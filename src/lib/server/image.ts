import sharp from 'sharp';

// Takes a base64 string and returns an optimized image (WebP with some resizing)
export async function optimizeImage(data: string) {
	const optimized = await sharp(Buffer.from(data, 'base64'))
		.resize(1920, 1080, { fit: 'inside' })
		.webp()
		.toBuffer();

	return optimized.toString('base64');
}
