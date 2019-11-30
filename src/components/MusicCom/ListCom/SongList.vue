<template>
  <div class="cm-songlist-container">
    <div class="cm-songlist-head">
      <span class="num">序号</span>
      <span class="name">音乐标题</span>
      <span class="singer">歌手</span>
      <span class="album">专辑</span>
      <span class="time" v-if="type !== 'local'">时长</span>
      <span class="size" v-else>大小</span>
      <span class="control">操作</span>
    </div>
    <DynamicScroller
      class="cm-songlist"
      :items="listData"
      :min-item-size="0"
      :item-size="40"
      :page-mode="page"
      @scroll.native.passive="scrollToLoad"
      v-slot="{ item, index }"
    >
      <li
        @click="clickToPlay(item, index)"
        :class="item.play + (index % 2 === 0 ? ' cm-list-odd' : '')"
        ripple=""
      >
        <span class="num" v-if="!item.play">
          {{ needZero(index + 1) }}
        </span>
        <span class="num sf-icon-volume-up" v-else></span>
        <span class="name">
          {{ item.title }}
          <button
            class="sf-icon-youtube-play"
            @click.stop="playMv(item)"
            v-if="item.mvid"
          ></button>
        </span>
        <span class="singer">
          {{ item.artist }}
        </span>
        <span class="album">
          {{ item.album }}
        </span>
        <span class="time" v-if="type !== 'local'">
          {{ timeDeal(item.time) }}
        </span>
        <span class="size" v-else>
          {{ FileSize(item.size) }}
        </span>
        <span class="control">
          <LikeMusic
            :music="item"
            :index="index"
            @like="likeCallback"
          ></LikeMusic>
          <AddMusic :music="item"></AddMusic>
          <DownMusic :music="item"></DownMusic>
          <button
            class="sf-icon-trash-alt"
            @click.stop="removeMusic(item, index)"
            v-if="
              type === 'local' ||
                playListData.creator.userId === $Api.User.UserId
            "
          ></button>
        </span>
      </li>
    </DynamicScroller>
    <NoData v-show="listData.length === 0 && !loading"></NoData>
    <loading v-show="loading"></loading>
  </div>
</template>

<script>
import media from "../../../tools/music/media";
import LikeMusic from "../Button/LikeMusic";
import AddMusic from "../Button/AddMusic";
import DownMusic from "../Button/DownMusic";
export default {
  name: "SongList",
  inject: ["nowPlay", "playMusic"],
  components: {
    LikeMusic,
    AddMusic,
    DownMusic
  },
  props: {
    data: Array,
    type: String,
    loading: Boolean,
    page: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  data() {
    return {
      listData: [],
      playListData: {
        creator: {
          userId: ""
        }
      }
    };
  },
  watch: {
    data: function() {
      if (this.data.length === 0) {
        return (this.listData = []);
      }
      if (this.type === "local") {
        this.listData = this.data;
      } else {
        if (this.$route.query.list) {
          this.playListData = JSON.parse(this.$route.query.list);
        }
        this.listData = this.$handleListData(
          this.data,
          this.playListData.id || "local",
          true
        );
      }
      this.listData.some(item => {
        if (
          item.id !== undefined &&
          item.id === this.nowPlay().id &&
          item.playList === this.nowPlay().playList
        ) {
          item.play = "playing";
          this.playMusic(item, this.listData);
        }
      });
    }
  },
  methods: {
    FileSize(bytes) {
      bytes = parseFloat(bytes);
      if (bytes === 0) return "0B";
      let k = 1024,
        sizes = ["B", "KB", "MB", "GB", "TB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
    },
    needZero(count) {
      count = parseInt(count);
      return count < 10 ? "0" + count : count;
    },
    timeDeal(s) {
      return media.secondDeal(s / 1000);
    },
    clickToPlay(item) {
      this.playMusic(item, this.listData);
    },
    scrollToLoad(e) {
      let element = e.target;
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        this.$emit("scroll-end");
      }
    },
    playMv(item) {
      this.$router.push({
        path: "/video-detail/" + item.mvid,
        query: {
          data: JSON.stringify(item)
        }
      });
    },
    likeCallback(item, index) {
      if (item.like === false) {
        if (JSON.parse(this.$route.query.list || "{}").specialType === 5) {
          this.listData.splice(index, 1);
        }
      }
    },
    removeMusic(item, index) {
      if (item.play) {
        return this.$Message.warning("你不能删除一首正在播放的歌");
      }
      this.Confirm({
        title: "移除歌曲",
        tips: "确认将这首歌从歌单移除吗",
        callback: () => {
          if (item.type === "local") {
            this.listData.splice(index, 1);
            this.$Api.LocalFile.write("local-music", this.listData);
            return this.$emit("remove", this.listData.length);
          }
          this.$Api.Music.song.removeFromList(
            {
              pid: this.$route.params.id,
              tracks: item.id
            },
            rs => {
              if (rs.code === 200) {
                this.listData.splice(index, 1);
                this.$emit("remove", rs.count);
              } else {
                this.$Message.error("删除失败");
              }
            }
          );
        }
      });
    }
  }
};
</script>

<style scoped>
.cm-songlist-container {
  width: 100%;
  height: 100%;
  min-height: 330px;
  position: relative;
}
.cm-songlist {
  width: 100%;
  height: calc(100% - 40px);
  overflow-y: auto;
}
.cm-songlist li,
.cm-songlist-head {
  width: 100%;
  height: 40px;
  overflow: hidden;
}
.cm-songlist li *,
.cm-songlist-head * {
  height: 100%;
  line-height: 40px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cm-songlist li * {
  color: #888888;
}
.cm-songlist li .num,
.cm-songlist-head .num {
  width: 50px;
  text-align: center;
}
.cm-songlist li .name,
.cm-songlist-head .name {
  width: calc(40% - 50px);
  color: #333;
}
.cm-songlist li .singer,
.cm-songlist-head .singer {
  width: calc(30% - 95px);
}
.cm-songlist li .album,
.cm-songlist-head .album {
  width: calc(30% - 95px);
}
.cm-songlist li .size,
.cm-songlist-head .size {
  width: 60px;
}
.cm-songlist li .time,
.cm-songlist-head .time {
  width: 60px;
}
.cm-songlist li .control,
.cm-songlist-head .control {
  width: 100px;
}
.cm-songlist li .control button,
.cm-songlist li .name button {
  background: none;
  padding: 0 3px;
  color: #737373;
}
.cm-songlist li .name .sf-icon-youtube-play,
.cm-songlist li .control .sf-icon-youtube-play {
  color: #e56464;
}
.cm-songlist li .control .sf-icon-heart {
  color: #e56464;
}
.cm-songlist li .sf-icon-volume-up {
  color: #e56464;
}
.cm-songlist li:hover,
.playing {
  color: #333333 !important;
  background: #efefef !important;
}
.cm-list-odd {
  background: #f9f9f9;
}
</style>
