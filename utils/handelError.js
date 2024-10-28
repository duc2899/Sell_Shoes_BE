exports.handelError = (err, res) => {
  if (err.code === 11000) {
    // Lỗi trùng lặp unique
    const duplicateKey = Object.keys(err.keyValue)[0]; // Lấy key bị trùng lặp
    const errorMessage = `${duplicateKey} has been neutralized`;

    return res.status(400).json({
      status: "400",
      message: errorMessage,
    });
  } else if (err.errors) {
    // Xử lý các lỗi khác từ Mongoose validation
    let errors = [];
    for (const property in err.errors) {
      errors.push(err.errors[property].message);
    }
    return res.status(400).json({
      status: "400",
      message: errors,
    });
  } else {
    // Xử lý các lỗi không mong muốn khác
    return res.status(500).json({
      status: "500",
      message: "An unexpected error occurred",
    });
  }
};
