const { Router } = require("express");

const router = express.Router()
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please login instead."
            });
        }

        const _newUser = new UserModel({ name, email, password });
        await _newUser.save();

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: _newUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, error: error.message });
    }
});
 module.exports = Router 




router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login instead.",
      });
    }

  const bcrypt = require("bcryptjs");
  const hashedPassword = await bcrypt.hash(password, 10);

    const _newUser = new UserModel({ name, email, password: hashedPassword });
    await _newUser.save();

    const { password: pw, ...userData } = _newUser._doc; // remove password from response

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found. Please signup." });
    }

  const bcrypt = require("bcryptjs");
  const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const { password: pw, ...userData } = user._doc; // remove password from response

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: error.message });
  }
});


