function setupWith(setup, interaction) {
}

function on(action, interaction) {
}

const matCutInteraction = Interaction()
  .setupWith(matCutSetup)
  .on("DEVICE_OPEN", onDeviceOpen)
  .on("DEVICE_CLOSE", onDeviceClose);

const matCutInteraction2 = pipe(
  setupWith(matCutSetup),
  onDeviceOpen(() => {}),
)({});
