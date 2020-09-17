import { getSongsUrl } from "api/song";
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/${musicData.songmid}.m4a?guid=9954924964&vkey=9DEF79A430BC1BFDECDE4EB710FCF065D09D63E047CB0FFA70EACB693FA56C21CADC46305788712B7F4040C7E9105A4C6B127A57C40288CF&uin=0&fromtag=38`
  });
}

function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return "";
  }
  singer.forEach(s => {
    ret.push(s.name);
  });
  return ret.join("/");
}

export function isValidMusic(musicData) {
  return (
    musicData.songid &&
    musicData.albummid &&
    (!musicData.pay || musicData.pay.payalbumprice === 0)
  );
}

export function processSongsUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }
  return getSongsUrl(songs).then(purlMap => {
    songs = songs.filter(song => {
      const purl = purlMap[song.mid];
      if (purl) {
        song.url =
          purl.indexOf("http") === -1
            ? `http://dl.stream.qqmusic.qq.com/${purl}`
            : purl;
        return true;
      }
      return false;
    });
    return songs;
  });
}
