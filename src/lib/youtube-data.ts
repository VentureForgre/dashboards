export const youtubeData = {
  is_sample: false,
  channel: {
    total_subscribers: 1,
    total_views_all_time: 0,
    total_videos: 0
  },
  videos: [
    {
      title: "Weird Fails & Wins That Will Leave You Speechless #shorts",
      video_id: "zTWnztnxedc",
      views: 1,
      likes: 0,
      comments: 0,
      ctr: 0,
      subs_gained: 0,
      avg_view_percentage: 0,
      watch_minutes: 0,
      thumbnail: "https://i9.ytimg.com/vi/zTWnztnxedc/default.jpg?sqp=COypwtIG&rs=AOn4CLDdkDwOr1mMgQMZHDFGJVG81PxmPw"
    },
    {
      title: "Cats Causing Absolute CHAOS! You Won't Believe What Happens Next #shorts",
      video_id: "K54PIwD01tE",
      views: 1,
      likes: 0,
      comments: 0,
      ctr: 0,
      subs_gained: 0,
      avg_view_percentage: 0,
      watch_minutes: 0,
      thumbnail: "https://i9.ytimg.com/vi/K54PIwD01tE/default.jpg?sqp=COypwtIG&rs=AOn4CLAlPCUmpCXP112Mc6IwY7LJWcsNfQ"
    },
    {
      title: "Funny Dogs Going WILD! You Can't Stop Laughing #shorts",
      video_id: "fQfvIR7l25c",
      views: 0,
      likes: 0,
      comments: 0,
      ctr: 0,
      subs_gained: 0,
      avg_view_percentage: 0,
      watch_minutes: 0,
      thumbnail: "https://i9.ytimg.com/vi/fQfvIR7l25c/default.jpg?sqp=COypwtIG&rs=AOn4CLDBO_znExjKpuMvY7Uk5mFybp8UQQ"
    },
    {
      title: "Cutest Animals You'll See Today! Heart Melting #shorts",
      video_id: "KM_npKvGbWg",
      views: 0,
      likes: 0,
      comments: 0,
      ctr: 0,
      subs_gained: 0,
      avg_view_percentage: 0,
      watch_minutes: 0,
      thumbnail: "https://i9.ytimg.com/vi/KM_npKvGbWg/default.jpg?sqp=COypwtIG&rs=AOn4CLAaffFzCFThz42u0YWrXxfXSgHLCw"
    },
    {
      title: "Epic Fails Compilation! You Can't Look Away #shorts",
      video_id: "H3LRrfOFgTI",
      views: 0,
      likes: 0,
      comments: 0,
      ctr: 0,
      subs_gained: 0,
      avg_view_percentage: 0,
      watch_minutes: 0,
      thumbnail: "https://i9.ytimg.com/vi/H3LRrfOFgTI/default.jpg?sqp=COypwtIG&rs=AOn4CLCulIwomf_Ff2C_qS2DzxUOufnwNQ"
    }
  ],
  daily: {
    dates: [
      "2026-06-11",
      "2026-06-12",
      "2026-06-13",
      "2026-06-14",
      "2026-06-15",
      "2026-06-16",
      "2026-06-17",
      "2026-06-18",
      "2026-06-19",
      "2026-06-20",
      "2026-06-21",
      "2026-06-22",
      "2026-06-23",
      "2026-06-24",
      "2026-06-25",
      "2026-06-26",
      "2026-06-27",
      "2026-06-28",
      "2026-06-29",
      "2026-06-30",
      "2026-07-01",
      "2026-07-02",
      "2026-07-03",
      "2026-07-04",
      "2026-07-05",
      "2026-07-06",
      "2026-07-07",
      "2026-07-08",
      "2026-07-09",
      "2026-07-10"
    ],
    views: Array(30).fill(0) as number[],
    subs_gained: Array(30).fill(0) as number[],
    subs_lost: Array(30).fill(0) as number[],
    subs_cumulative: Array(30).fill(0) as number[],
    impressions: Array(30).fill(0) as number[],
    ctr: Array(30).fill(0) as number[],
    watch_minutes: Array(30).fill(0) as number[]
  }
};

export function youtubeSummary() {
  const totalViews = youtubeData.videos.reduce((sum, video) => sum + video.views, 0);
  const totalWatch = youtubeData.videos.reduce((sum, video) => sum + video.watch_minutes, 0);
  const ctrValues = youtubeData.videos.map((video) => video.ctr).filter((ctr) => ctr > 0);
  const avgCtr = ctrValues.length ? ctrValues.reduce((sum, ctr) => sum + ctr, 0) / ctrValues.length : 0;
  return {
    totalViews,
    totalSubscribers: youtubeData.channel.total_subscribers,
    avgCtr,
    totalWatch
  };
}
