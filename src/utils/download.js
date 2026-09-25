import api from '../services/api';

/**
 * Downloads a file from an API endpoint using axios with responseType: 'blob'.
 * Automatically attaches Authorization header via api interceptor.
 */
export const downloadApiFile = async (url, defaultFilename = 'download') => {
  const response = await api.get(url, {
    responseType: 'blob'
  });

  // Extract filename from Content-Disposition header if available
  let filename = defaultFilename;
  const disposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
  if (disposition && disposition.includes('filename=')) {
    const match = disposition.match(/filename="?([^";]+)"?/);
    if (match && match[1]) {
      filename = match[1].trim();
    }
  }

  // Create Blob and trigger download
  const blob = new Blob([response.data], {
    type: response.headers['content-type'] || 'application/octet-stream'
  });
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
  return filename;
};

/**
 * Downloads text or JSON data directly as a file from client memory (offline fallback).
 */
export const downloadClientFile = (content, filename, mimeType = 'text/plain;charset=utf-8') => {
  const blob = new Blob([content], { type: mimeType });
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};
