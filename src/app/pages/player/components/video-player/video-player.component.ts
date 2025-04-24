import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-player">
      <video
        #videoElement
        class="video-element"
        (click)="togglePlay()"
        (timeupdate)="onTimeUpdate()"
        (loadedmetadata)="onLoadedMetadata()"
        (ended)="onVideoEnded()"
      >
        <source [src]="videoUrl" type="video/mp4">
        Tu navegador no soporta el elemento de video.
      </video>

      <div class="video-controls" [class.show]="showControls">
        <div class="progress-bar">
          <div class="progress" [style.width.%]="progress"></div>
        </div>

        <div class="controls-bottom">
          <div class="controls-left">
            <button class="control-button" (click)="togglePlay()">
              <i class="fas" [class.fa-play]="!isPlaying" [class.fa-pause]="isPlaying"></i>
            </button>
          </div>

          <div class="controls-right">
            <div class="time-display">
              {{ currentTime }} / {{ duration }}
            </div>
            <button class="control-button" (click)="toggleMute()">
              <i class="fas" [class.fa-volume-up]="!isMuted" [class.fa-volume-mute]="isMuted"></i>
            </button>
            <button class="control-button" (click)="toggleFullscreen()">
              <i class="fas fa-expand"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .video-player {
      position: relative;
      width: 100%;
      background: #000;
      aspect-ratio: 16/9;
    }

    .video-element {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .video-controls {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      padding: 1rem;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;

      &.show {
        opacity: 1;
        pointer-events: all;
      }
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: rgba(255,255,255,0.2);
      border-radius: 2px;
      margin-bottom: 0.5rem;
      cursor: pointer;
      position: relative;

      &:hover {
        height: 6px;
      }
    }

    .progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: #e50914;
      border-radius: 2px;
    }

    .controls-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .controls-left, .controls-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .control-button {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 0.5rem;
      font-size: 1.25rem;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.1);
      }
    }

    .time-display {
      color: #fff;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .video-controls {
        padding: 0.5rem;
      }

      .control-button {
        font-size: 1rem;
      }

      .time-display {
        font-size: 0.75rem;
      }
    }
  `]
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  videoUrl: string = '';
  isPlaying: boolean = false;
  isMuted: boolean = false;
  showControls: boolean = false;
  progress: number = 0;
  currentTime: string = '0:00';
  duration: string = '0:00';
  private controlsTimeout: any;

  ngOnInit() {}

  ngAfterViewInit() {
    this.setupEventListeners();
  }

  ngOnDestroy() {
    this.clearControlsTimeout();
  }

  private setupEventListeners() {
    const video = this.videoElement.nativeElement;
    video.addEventListener('mousemove', () => this.showControlsTemporarily());
    video.addEventListener('mouseleave', () => this.hideControls());
  }

  togglePlay() {
    const video = this.videoElement.nativeElement;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    this.isPlaying = !video.paused;
    this.showControlsTemporarily();
  }

  toggleMute() {
    const video = this.videoElement.nativeElement;
    video.muted = !video.muted;
    this.isMuted = video.muted;
    this.showControlsTemporarily();
  }

  toggleFullscreen() {
    const video = this.videoElement.nativeElement;
    if (!document.fullscreenElement) {
      video.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    this.showControlsTemporarily();
  }

  onTimeUpdate() {
    const video = this.videoElement.nativeElement;
    this.progress = (video.currentTime / video.duration) * 100;
    this.currentTime = this.formatTime(video.currentTime);
  }

  onLoadedMetadata() {
    const video = this.videoElement.nativeElement;
    this.duration = this.formatTime(video.duration);
  }

  onVideoEnded() {
    this.isPlaying = false;
    this.progress = 0;
    this.currentTime = '0:00';
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private showControlsTemporarily() {
    this.showControls = true;
    this.clearControlsTimeout();
    this.controlsTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.hideControls();
      }
    }, 3000);
  }

  private hideControls() {
    if (this.isPlaying) {
      this.showControls = false;
    }
  }

  private clearControlsTimeout() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
  }
}
