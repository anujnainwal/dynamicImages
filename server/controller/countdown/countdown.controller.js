let { createCanvas, loadImage, registerFont } = require("canvas");
let moment = require("moment");
let GIFEncoder = require("gifencoder");
let { createWriteStream } = require("fs");
let exec = require("child_process").exec;
// exports.getCountDown = (req, res, next) => {
//   try {
//     let canvasWidth = 320;
//     let canvasHeight = 240;
//     let frameDelay = 500; // 500ms delay between frames
//     let imageQuality = 10;

//     let encoder = new GIFEncoder(canvasWidth, canvasHeight);
//     encoder.start();
//     encoder.setRepeat(0);
//     encoder.setDelay(frameDelay);
//     encoder.setQuality(imageQuality);
//     let futureDate = new Date("2023-06-01");
//     let canvas = createCanvas(canvasWidth, canvasHeight);
//     let ctx = canvas.getContext("2d");
//     let currentTime = new Date();

//     let futureTime = Math.floor(futureDate - currentTime / 1000);
//     console.log(futureTime);

//     let remainingTime = 60; // Countdown duration of 60 seconds

//     function drawCountdownFrame() {
//       ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//       let hours = Math.floor((remainingTime % (60 * 60 * 24)) / (60 * 60));
//       let minutes = Math.floor(remainingTime / 60);
//       let seconds = remainingTime % 60;

//       ctx.fillStyle = "#000000";
//       ctx.fillRect(0, 0, canvasWidth, canvasHeight);

//       ctx.font = "48px Arial";
//       ctx.fillStyle = "#FFFFFF";
//       ctx.textAlign = "center";
//       ctx.fillText(
//         `${minutes.toString().padStart(2, "0")}:${seconds
//           .toString()
//           .padStart(2, "0")}`,
//         canvasWidth / 2,
//         canvasHeight / 2
//       );

//       encoder.addFrame(ctx);

//       remainingTime--;

//       if (remainingTime >= 0) {
//         setTimeout(drawCountdownFrame, frameDelay);
//       } else {
//         encoder.finish();
//         let gifData = encoder.out.getData();
//         res.set({
//           "Content-Type": "image/gif",
//           "Content-Disposition": 'inline; filename="countdown.gif"',
//           "Cache-Control": "no-cache, no-store, must-revalidate",
//           Pragma: "no-cache",
//           Expires: "0",
//         });
//         res.send(gifData);
//       }
//     }

//     drawCountdownFrame();
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: error.message });
//   }
// };

exports.getCountDown = (req, res) => {
  // Get the future date from the query parameters
  let futureDate = new Date("2023-06-01");

  // Get the current date and time
  let currentDate = new Date();

  // Calculate the remaining time in milliseconds
  let remainingTime = futureDate - currentDate;

  // If the remaining time is negative or zero, return an error response
  if (remainingTime <= 0) {
    return res.status(400).json({ error: "Invalid future date" });
  }

  // Calculate the remaining time in seconds
  let remainingSeconds = Math.floor(remainingTime / 1000);

  // Create a canvas and context
  let canvas = createCanvas(400, 200);
  let ctx = canvas.getContext("2d");

  // Set the font properties
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";

  // Function to update the countdown text
  let updateCountdownText = () => {
    // Calculate the remaining days, hours, minutes, and seconds
    let days = Math.floor(remainingSeconds / (24 * 60 * 60));
    let hours = Math.floor((remainingSeconds % (24 * 60 * 60)) / (60 * 60));
    let minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);
    let seconds = remainingSeconds % 60;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the countdown text on the canvas
    let countdownText = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

    ctx.fillText(countdownText, 30, 100);

    // Decrement the remaining seconds
    remainingSeconds--;

    // If the remaining seconds is less than 0, stop the interval
    if (remainingSeconds < 0) {
      clearInterval(interval);
      console.log("asd");
    }
  };

  // Update the countdown text initially
  updateCountdownText();
  let image = canvas.toBuffer();
  res.set("Content-Type", "image/gif");
  res.send(image);
  // Update the countdown text every second using setInterval
  let interval = setInterval(updateCountdownText, 1000);

  // Render the canvas as a PNG image and send it as the response
};
