const Account = require('../models/Account');

// Fetch all accounts (users) for a specific business
exports.fetchUsersList = async (req, res) => {
  const { business_id } = req.params;

  try {
    // Fetch accounts associated with the business_id
    const accounts = await Account.find({ business_id });
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new account (formerly addNewUser)
exports.addNewAccount = async (req, res) => {
  const { business_id } = req.params;
  const { email, name, role, password } = req.body;

  try {
    // Validate required fields
    if (!email || !name || !role || !password) {
      return res.status(400).json({ error: 'Missing required fields: email, name, role, and password' });
    }

    // Create a new account associated with a business
    const account = new Account({
      business_id,
      email,
      name,
      role,
      password,  // Ideally, hash the password before saving
    });

    await account.save();

    res.status(201).json({
      message: 'Account created successfully',
      account,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Accept role invitation (Update role of an existing account)
exports.acceptRoleInvitation = async (req, res) => {
  const { email, role } = req.body;

  try {
    // Find account by email and update the role
    const account = await Account.findOneAndUpdate(
      { email },
      { role },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.status(200).json({
      message: 'Role updated successfully',
      account,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
