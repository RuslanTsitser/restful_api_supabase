// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import { Bot } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("Hello from Functions!")

const TOKEN = Deno.env.get("UPLOAD_TELEGRAM_BOT_TOKEN") || "";

const chatId = Deno.env.get("UPLOAD_TELEGRAM_CHAT_ID");

interface FileLink {
  file_id: string;
  url: string;
  width: number;
  height: number;
  size: number;
}

async function makeFileLink(fileIds: string[]): Promise<FileLink[]> {
  const files = await Promise.all(fileIds.map(async (fileId) => {
    const fileUrl = await fetch(`https://api.telegram.org/bot${TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileUrl.json();
    const filePath = fileData.result.file_path || "";
    return {
      file_id: fileId,
      width: fileData.result.width,
      height: fileData.result.height,
      size: fileData.result.file_size,
      url: `https://api.telegram.org/file/bot${TOKEN}/${filePath}`,
    }
  }));
  return files;
}


Deno.serve(async (req) => {
  try {
    // Get image data from request
    const imageData = await req.arrayBuffer();
    const imageBytes = new Uint8Array(imageData);
    const formData = new FormData();
    formData.append("photo", new Blob([imageBytes]));
    formData.append("chat_id", chatId || "");

    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
      method: "POST",
      body: formData
    });
    console.log(response);
    const data = await response.json();
    const images = await makeFileLink(data.result.photo.map((photo: any) => photo.file_id));
    return new Response(JSON.stringify({
      images: images,
    }));
  } catch (error: unknown) {
    console.error("Error sending photo:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
})

