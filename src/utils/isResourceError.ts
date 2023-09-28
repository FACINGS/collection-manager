export function isResourceError(str) {
  const message = str.toLowerCase();
  const resourceError =
    message.includes('cpu') ||
    message.includes('ram') ||
    message.includes('net');

  return resourceError;
}
