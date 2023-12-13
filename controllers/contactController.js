const asyncHandler = require("express-async-handler");
const contact = require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//@desc Get contact by id
//@route GET /api/contacts/id
//@access private
const getContact = asyncHandler(async (req, res) => {
  const Contact = await contact.findById(req.params.id);
  if (!Contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }
  res.status(200).json(Contact);
});

//@desc Create a contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory.");
  }
  const Contact = await contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  res.status(201).json(Contact);
});

//@desc Update a contact
//@route PUT /api/contacts/id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const Contact = await contact.findById(req.params.id);
  if (!Contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }
  if (Contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission");
  }

  const updatedContact = await contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

//@desc Delete a contact
//@route DELETE /api/contacts/id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const Contact = await contact.findById(req.params.id);
  if (!Contact) {
    res.status(404).json({ error: "Contact not found" });
  }

  if (Contact.user_id.toString() !== req.user.id) {
    res.status(403).json({ error: "User doesn't have permission" });
  }

  await contact.deleteOne({ _id: req.params.id });
  res.status(200).json(Contact);
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
