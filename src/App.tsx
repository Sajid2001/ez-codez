import QRCode from "qrcode";
import { useState } from "react";

function App() {
  const [url, setUrl] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generateQRCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("log from generateQRCode");

      // Generate the QR Code
      const qrCanvas = document.createElement("canvas");
      const qrCanvasSize = 512;
      qrCanvas.width = qrCanvasSize;
      qrCanvas.height = qrCanvasSize;
      await QRCode.toCanvas(qrCanvas, url, {
        errorCorrectionLevel: "H",
        width: qrCanvasSize,
      });

      // Check if a logo is provided
      const logoInput = document.querySelector(
        "input[type='file']"
      ) as HTMLInputElement;
      const logoFile = logoInput?.files?.[0];

      if (logoFile) {
        // Draw logo onto the QR Code
        const ctx = qrCanvas.getContext("2d");
        if (ctx) {
          const logo = new Image();
          logo.src = URL.createObjectURL(logoFile);

          await new Promise((resolve) => {
            logo.onload = () => {
              const logoSize = qrCanvas.width * 0.25;
              const centerX = (qrCanvas.width - logoSize) / 2;
              const centerY = (qrCanvas.height - logoSize) / 2;

              // Draw white background square
              const padding = logoSize * 0.1;
              ctx.fillStyle = "white";
              ctx.fillRect(
                centerX - padding,
                centerY - padding,
                logoSize + 2 * padding,
                logoSize + 2 * padding
              );

              // Draw the logo
              ctx.drawImage(logo, centerX, centerY, logoSize, logoSize);
              resolve(null);
            };
          });
        }
      }

      const qr = qrCanvas.toDataURL();
      setQrCode(qr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQrCode = () => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "qr-code.png";
    link.click();
  };

  return (
    <main className="w-1/3 m-auto h-screen flex flex-col pt-5">
      <h1 className="text-center text-5xl font-bold">
        <i className="fas fa-bolt mr-2" />
        EZ Codez
      </h1>
      <h1 className="text-center text-2xl pt-3">Create a QR Code in 2 steps</h1>
      <form className="flex flex-col gap-4 my-5">
        <input
          placeholder="QR Code URL"
          className="px-4 py-2 border-2  rounded-md focus:outline-emerald-600"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          placeholder="Logo (optional)"
          className="px-4 py-2 cursor-pointer border-2 rounded-md focus:outline-emerald-600 file:border-0 file:bg-emerald-200 file:px-4 file:py-2 file:rounded-md"
          type="file"
        />
      </form>
      <button
        disabled={!url || loading}
        onClick={generateQRCode}
        className="px-4 py-2 bg-emerald-600 rounded-sm font-bold text-white disabled:bg-emerald-100  disabled:text-gray-300"
      >
        <i className="fas fa-bolt mr-2" />
        Generate
      </button>

      {qrCode && (
        <section className="flex flex-col mb-3 w-full items-center ">
          <img src={qrCode} className="w-2/3 m-auto" alt="QR Code" />
          <button
            onClick={() => {
              downloadQrCode();
            }}
            className="w-2/3 px-4 py-2 bg-emerald-600 rounded-sm font-bold text-white disabled:bg-emerald-100  disabled:text-gray-300"
          >
            <i className="fas fa-download mr-2" />
            Download
          </button>
        </section>
      )}
    </main>
  );
}

export default App;
