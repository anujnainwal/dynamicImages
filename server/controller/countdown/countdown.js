const { fabric } = require("fabric");
const GIFEncoder = require("gifencoder");
const fs = require("fs");

// Function to convert a given date to days, hours, minutes, seconds, and milliseconds
function convertToDateParts(date) {
  const currentDate = new Date();
  const targetDate = new Date(date);

  const timeDiff = Math.abs(targetDate - currentDate);
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  const milliseconds = timeDiff % 1000;

  return { days, hours, minutes, seconds, milliseconds };
}

// Function to generate the countdown timer GIF
function generateCountdownGif(date, res) {
  const canvasWidth = 400;
  const canvasHeight = 200;
  const fontSize = 48;
  const fontColor = "#FFFFFF";
  const backgroundColor = "#000000";

  const canvas = new fabric.StaticCanvas(null, {
    width: canvasWidth,
    height: canvasHeight,
    backgroundColor: backgroundColor,
  });

  const countdownText = new fabric.Text("", {
    fontSize: fontSize,
    fill: fontColor,
  });

  canvas.add(countdownText);
  countdownText.set({
    left: canvasWidth / 2 - countdownText.width / 2,
    top: canvasHeight / 2 - countdownText.height / 2,
  });

  const encoder = new GIFEncoder(canvasWidth, canvasHeight);
  encoder.setRepeat(0);
  encoder.setDelay(100);
  encoder.start();

  const { days, hours, minutes, seconds, milliseconds } =
    convertToDateParts(date);
  const countdownDuration =
    days * 24 * 60 * 60 * 1000 +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000 +
    milliseconds;

  const startTime = Date.now();

  function updateCountdown() {
    const remainingTime =
      countdownDuration - Math.floor(Date.now() - startTime);
    const remainingParts = convertToDateParts(remainingTime);

    countdownText.set({
      text: `${remainingParts.days}d ${remainingParts.hours}h ${remainingParts.minutes}m ${remainingParts.seconds}s ${remainingParts.milliseconds}ms`,
    });

    canvas.renderAll();
    encoder.addFrame(
      canvas.getContext().getImageData(0, 0, canvasWidth, canvasHeight).data
    );

    if (remainingTime > 0) {
      setTimeout(updateCountdown, 1000);
    } else {
      encoder.finish();
      res.set({
        "Content-Type": "image/gif",
        "Content-Disposition": 'inline; filename="countdown.gif"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      });
      res.send(encoder.out.getData());
    }
  }

  updateCountdown();
}

module.exports = {
  generateCountdownGif,
};
