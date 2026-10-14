import { motion } from 'framer-motion';
import './VideoPlayer.css';

/**
 * VideoPlayer component for lesson videos
 * 
 * Currently supports:
 * - External video URLs (shows play button linking to video)
 * - Coming soon state (shows placeholder)
 * 
 * TODO: Cloudinary SDK integration
 * When cloudinaryId is provided, use the Cloudinary Video Player:
 * 1. Import: import { Cloudinary } from '@cloudinary/url-gen';
 * 2. Initialize: const cld = new Cloudinary({ cloud: { cloudName: 'YOUR_CLOUD_NAME' } });
 * 3. Get video: const video = cld.video(cloudinaryId);
 * 4. Use AdvancedVideo component or embed player
 */
export function VideoPlayer({ cloudinaryId: _cloudinaryId, videoUrl }) {
  const hasVideo = videoUrl && videoUrl.trim() !== '';
  // TODO: Check cloudinaryId when Cloudinary is integrated
  // const hasCloudinaryVideo = _cloudinaryId && _cloudinaryId.trim() !== '';

  if (hasVideo) {
    return (
      <motion.div 
        className="video-player-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="video-placeholder">
          <a 
            href={videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="play-button"
          >
            <span>▶</span>
          </a>
          <p>اضغط لمشاهدة الفيديو</p>
        </div>
      </motion.div>
    );
  }

  // TODO: Add Cloudinary player when cloudinaryId is available
  // if (hasCloudinaryVideo) {
  //   return (
  //     <div className="video-player-container cloudinary">
  //       {/* Cloudinary Video Player will go here */}
  //     </div>
  //   );
  // }

  return (
    <motion.div 
      className="video-coming-soon"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <span className="coming-icon">🎬</span>
      <h3>الفيديو قريبًا</h3>
      <p>الشرح ده لسه ما اتسجلش. هيتضاف قريب إن شاء الله.</p>
    </motion.div>
  );
}
