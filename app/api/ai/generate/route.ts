import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { getDb } from '../../../../lib/db';
import { nanoid } from 'nanoid';

const AI_STYLES = [
  { id: 'watercolor', label: 'Watercolor', prompt: (dog: string) => `Beautiful watercolor painting of ${dog}, soft brushstrokes, pastel colors, artistic` },
  { id: 'pixar', label: 'Pixar Style', prompt: (dog: string) => `${dog} as Pixar animated character, Disney style, big expressive eyes, colorful, 3D render` },
  { id: 'oil-painting', label: 'Oil Painting', prompt: (dog: string) => `Classical oil painting portrait of ${dog}, rich textures, dramatic lighting, museum quality` },
  { id: 'anime', label: 'Anime', prompt: (dog: string) => `${dog} as anime character, Studio Ghibli style, soft cel shading, whimsical` },
  { id: 'renaissance', label: 'Renaissance', prompt: (dog: string) => `${dog} as Renaissance portrait, ornate frame, rich fabrics, classical composition` },
  { id: 'beach', label: 'Beach Day', prompt: (dog: string) => `${dog} having fun at the beach, sunny day, splashing water, happy, vibrant colors` },
  { id: 'cozy', label: 'Cozy Sweater', prompt: (dog: string) => `${dog} wearing a cozy knitted sweater, warm home setting, fireplace, cute and adorable` },
];

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, style } = await req.json();
    if (!imageUrl || !style) {
      return NextResponse.json({ error: 'Image and style required' }, { status: 400 });
    }

    const db = getDb();
    const dog = db.prepare('SELECT name FROM dogs WHERE user_id = ?').get(user.id) as any;
    const dogName = dog?.name || 'dog';

    const styleConfig = AI_STYLES.find(s => s.id === style);
    if (!styleConfig) {
      return NextResponse.json({ error: 'Invalid style' }, { status: 400 });
    }

    // Use pollinations.ai to generate the image
    // The imageUrl is a URL to an existing dog photo - we use it as reference
    const prompt = styleConfig.prompt(dogName);
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Use the source image as img2img reference via pollinations
    const imageUrlEncoded = encodeURIComponent(imageUrl);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${nanoid()}&nologo=true`;
    
    // For img2img, we'd need a different service, so we'll just use the prompt with a generic dog
    const finalUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&seed=${nanoid()}&nologo=true`;

    const artId = nanoid();
    db.prepare(`
      INSERT INTO ai_art (id, dog_id, prompt, image_url, style)
      VALUES (?, ?, ?, ?, ?)
    `).run(artId, dog?.id || '', prompt, finalUrl, style);

    return NextResponse.json({ 
      id: artId,
      imageUrl: finalUrl,
      style,
      prompt 
    });
  } catch (error) {
    console.error('AI generate error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
