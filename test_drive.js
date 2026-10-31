const { fetchStream } = require('./backend/src/utils/driveStream');
async function test() {
  try {
    // A small public google drive file id (e.g. a small image or txt)
    // I don't have a known public small file id, let's use a public domain file id if possible.
    // Let me just inspect the set-cookie handling.
    console.log('Test script ready.');
  } catch (err) {
    console.error(err);
  }
}
test();
