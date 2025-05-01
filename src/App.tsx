import { useState, useEffect, useRef } from 'react'
import { Play, Shield } from 'lucide-react'

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [identifier, setIdentifier] = useState({
    x: 15,
    y: 15,
    text: String(Math.floor(10000 + Math.random() * 90000))
  })
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (videoRef.current) {
        setVideoDimensions({
          width: videoRef.current.clientWidth,
          height: videoRef.current.clientHeight
        })
      }
    }

    const video = videoRef.current
    video?.addEventListener('loadedmetadata', updateDimensions)
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => {
      window.removeEventListener('resize', updateDimensions)
      video?.removeEventListener('loadedmetadata', updateDimensions)
    }
  }, [])

  useEffect(() => {
    if (!isPlaying || videoDimensions.width === 0) return

    const moveInterval = setInterval(() => {
      setIdentifier(prev => ({
        ...prev,
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 90,
        text: prev.text
      }))
    }, 3000)

    return () => clearInterval(moveInterval)
  }, [isPlaying, videoDimensions])

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play().catch(console.error)
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: 'auto', background: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', padding: '1rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield />
          Protected Video Platform
        </h1>
        <div style={{ position: 'relative', marginTop: '1rem' }}>
          <video
            ref={videoRef}
            style={{ width: '100%', borderRadius: '8px' }}
            loop
            muted
            onClick={togglePlay}
            poster="https://peach.blender.org/wp-content/uploads/bbb-splash.png?x11217"
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
          </video>
          {isPlaying && (
            <div
              style={{
                position: 'absolute',
                left: `${identifier.x}%`,
                top: `${identifier.y}%`,
                color: 'rgba(255,255,255,0.4)',
                textShadow: '0 0 4px rgba(0,0,0,0.7)',
                transform: 'translate(-50%, -50%)',
                transition: 'all 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
                mixBlendMode: 'overlay',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                fontSize: '12px',
                pointerEvents: 'none',
                fontFamily: 'monospace'
              }}
            >
              {identifier.text}
            </div>
          )}
          <button
            onClick={togglePlay}
            style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            <Play style={{ width: '16px', height: '16px', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '14px', color: '#6b7280' }}>
          Numeric identifier moves across the video
        </p>
      </div>
    </div>
  )
}
