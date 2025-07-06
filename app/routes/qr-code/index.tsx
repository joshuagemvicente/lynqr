import { useLoaderData } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { data } from "react-router";
import { auth } from "~/lib/auth.server";
import { prisma } from "~/lib/prisma";
import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState, useRef } from "react";
import { Download, RefreshCcw, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "~/components/ui/slider";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    throw redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      id: true,
      name: true,
      linkUsername: true,
    }
  });

  if (!user) {
    throw redirect("/login");
  }

  return data({ user });
}

export default function QRCodeGenerator() {
  const { user } = useLoaderData<typeof loader>();
  const [customUrl, setCustomUrl] = useState(`http://localhost:5173/${user.linkUsername}`);
  const [qrSize, setQrSize] = useState(200);
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const qrRef = useRef<SVGSVGElement>(null);

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    try {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const svg = qrRef.current;
      const box = svg.getBoundingClientRect();

      // Set canvas dimensions to match SVG
      canvas.width = box.width;
      canvas.height = box.height;

      // Get canvas context and set background
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = qrBgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert SVG to data URL
      const data = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      // Create image from SVG and draw to canvas when loaded
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        // Convert canvas to PNG and trigger download
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `${user.linkUsername}-qrcode.png`;
        link.href = pngUrl;
        link.click();

        toast.success("QR code downloaded successfully");
      };

      img.src = url;
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  const resetToDefault = () => {
    setCustomUrl(`http://localhost/${user.linkUsername}`);
    setQrSize(200);
    setQrColor("#000000");
    setQrBgColor("#ffffff");
    toast.info("Reset to default settings");
  };

  const shareQRCode = async () => {
    if (!qrRef.current) return;

    try {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const svg = qrRef.current;
      const box = svg.getBoundingClientRect();

      // Set canvas dimensions to match SVG
      canvas.width = box.width;
      canvas.height = box.height;

      // Get canvas context and set background
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = qrBgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert SVG to data URL
      const data = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      // Create image from SVG and draw to canvas when loaded
      const img = new Image();
      img.onload = async () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        // Share the image
        canvas.toBlob(async (blob) => {
          if (blob && navigator.share) {
            try {
              await navigator.share({
                title: `${user.name}'s QR Code`,
                text: `Scan this QR code to visit my profile: ${customUrl}`,
                files: [new File([blob], `${user.linkUsername}-qrcode.png`, { type: 'image/png' })]
              });
              toast.success("QR code shared successfully");
            } catch (error) {
              console.error("Error sharing:", error);
              toast.error("Failed to share QR code");
            }
          } else {
            toast.error("Sharing is not supported on this browser");
          }
        });
      };

      img.src = url;
    } catch (error) {
      console.error("Error sharing QR code:", error);
      toast.error("Failed to share QR code");
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">QR Code Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile QR Code</CardTitle>
            <CardDescription>
              Scan this code to visit your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-8 bg-gray-50 rounded-md">
            <QRCodeSVG
              ref={qrRef}
              value={customUrl}
              size={qrSize}
              fgColor={qrColor}
              bgColor={qrBgColor}
              level="H"
              includeMargin={true}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetToDefault}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={shareQRCode}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={downloadQRCode}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customize</CardTitle>
            <CardDescription>
              Adjust your QR code settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={customUrl}
                disabled={true}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Enter URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="size"
                  type="range"
                  min="100"
                  max="300"
                  value={qrSize}
                  onChange={(e) => setQrSize(parseInt(e.target.value))}
                  className="w-full px-0 p-0"
                />
                <span className="text-sm font-medium">{qrSize}px</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">QR Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bgcolor">Background</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="bgcolor"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
