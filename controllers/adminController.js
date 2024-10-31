const Client = require("../models/client");
const deleteMultipleImages = require("../services/deleteImage");
const { isValidVietnamPhoneNumber } = require("../utils/checkPhoneNumber");
const { handelError } = require("../utils/handelError");

exports.uploadInforClient = async (req, res, next) => {
  try {
    const { files } = req;
    const { contact } = req.body;

    if (!files && !contact) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    // Prepare an update object
    const updateData = {};

    // Add imagesBanners to updateData if files are provided
    if (files && files.image) {
      const bannerData = files.image.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));
      updateData.$push = { imagesBanners: { $each: bannerData } };
    }

    // Add contact to updateData if provided
    if (contact) {
      if (isValidVietnamPhoneNumber(contact)) {
        updateData.contact = contact;
      } else {
        return res.status(400).json({ message: "Invalid contact number" });
      }
    }

    // Check if there's anything to update

    // Update or create the single Client document
    const client = await Client.findOneAndUpdate(
      {},
      updateData,
      { upsert: true, new: true } // Create document if it doesn't exist, return the updated document
    );

    return res
      .status(200)
      .json({ message: "Information updated successfully", client });
  } catch (err) {
    console.log(err);
    handelError(err, res);
  }
};

exports.getInforClient = async (req, res, next) => {
  try {
    // Fetch the single Client document, selecting only the imagesBanners field
    const client = await Client.findOne({}, "imagesBanners contact");

    if (!client) {
      return res.status(404).json({ message: "No  found" });
    }

    // Respond with the imagesBanners array
    res.status(200).json({ data: client, message: "successs" });
  } catch (err) {
    handelError(err, res);
  }
};

exports.updLoadImagesByUrl = async (req, res, next) => {
  try {
    const { imagesUrl } = req.body;
    if (imagesUrl.length <= 0) {
      return res.status(400).send({
        message: "Not founds images Url",
      });
    }
    for (let i = 0; i < imagesUrl.length; i++) {
      if (!isImageUrl(imagesUrl[i])) {
        return res.status(400).send({
          message: "Some images url invalid",
        });
      }
    }
    const result = await uploadImageFromUrl(imageUrl);
  } catch (err) {
    handelError(err, res);
  }
};

exports.deleteInforClient = async (req, res, next) => {
  try {
    const { public_id, contact } = req.body; // Expecting public_id for the banner to delete and a string for contact

    const updateData = {};
    let bannerExists = false;

    // Check if public_id is provided for deletion
    if (public_id) {
      // Find the client document and check if the public_id exists in imagesBanners
      const client = await Client.findOne({
        "imagesBanners.public_id": public_id[0],
      });

      if (client) {
        bannerExists = true; // Banner exists, set flag to true

        // Prepare the update object to remove the specific banner
        updateData.$pull = {
          imagesBanners: { public_id: public_id[0] },
        };

        await deleteMultipleImages(public_id);
      } else {
        // If client is found but public_id does not exist
        return res.status(404).json({ message: "Banner not founds" });
      }
    }

    // Check if contact is provided for deletion
    if (contact === null) {
      updateData.contact = null; // Set contact to null to delete it
    }

    // Update the Client document
    const client = await Client.findOneAndUpdate(
      {},
      updateData,
      { new: true } // Return the updated document
    );

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res
      .status(200)
      .json({ message: "Information deleted successfully", client });
  } catch (err) {
    console.log(err);
    handelError(err, res);
  }
};
