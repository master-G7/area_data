<template>
  <div class="dataView">
    <header>
      <div class="aerabox">
        <div class="lfetArea fl ">
          <div class="left small fl"></div>
          <div class="left big fl"></div>
        </div>
        <div
          class=" area fl "
          @click="chooseArea"
        >
          <div>{{areaObj.text}}<i class="cubeic-select"></i></div>
        </div>
        <div class="rightArea fl ">
          <div class="right big fl"></div>
          <div class="right small fl"></div>
        </div>
      </div>
    </header>
    <div class="inner">
      <div class="content">
        <div class="tittle">当天日赛</div>
        <div class="box">
          <div>
            <div class="tc ">{{money.totalpay?money.totalpay/100:money['sum(totalpay)']/100}}元</div>
            <div class="ccc">日赛总报名费</div>
          </div>
          <div>
            <div class="tc">{{money.totalbonus/100}}元</div>
            <div class="ccc">日赛总报名奖池</div>
          </div>
        </div>
      </div>

    </div>
    <div class="tittle">图表</div>
    <div id="main"></div>
    <div v-if="areaObj.value!=-1">
      <div class="tittle">赛区配置</div>
      <div class="config">
        <div class="bd">
          <div class="bl fl">
            <div>赛区名称</div>
            <div class="ccc">
              {{setObj.areaname}}
              <div
                class="blue"
                data-tittle="赛区名称"
                data-data="areaname"
                @click="config"
              >修改</div>
            </div>
          </div>
          <div class="fl">
            <div>日赛最大挑战次数</div>
            <div class="ccc">
              {{setObj.max_rounds}}次
              <div
                class="blue"
                data-tittle="日赛最大挑战次数"
                data-data="max_rounds"
                @click="config"
              >修改</div>
            </div>
          </div>
        </div>
        <div class="bd">
          <div class="bl fl">
            <div>日赛返奖率</div>
            <div class="ccc">
              {{setObj.bonus_percent}}%
              <div
                class="blue"
                data-tittle="日赛返奖率"
                data-percent='1'
                data-data="bonus_percent"
                @click="config"
              >修改</div>
            </div>
          </div>
          <div class="fl">
            <div>两连胜加成</div>
            <div class="ccc">
              {{setObj.combo1*100}}%
              <div
                class="blue"
                data-tittle="两连胜加成"
                data-percent='0'
                data-data="combo1"
                @click="config"
              >修改</div>
            </div>
          </div>
        </div>
        <div class="bd">
          <div class="bl fl">
            <div>三连胜加成</div>
            <div class="ccc">
              {{setObj.combo2 *100}}%
              <div
                class="blue"
                data-tittle="三连胜加成"
                data-percent='0'
                data-data="combo2"
                @click="config"
              >修改</div>
            </div>
          </div>
          <div class="fl">
            <div>挑战时间加成</div>
            <div class="ccc">
              {{setObj.time_factor*100}}%
              <div
                class="blue"
                data-tittle="挑战时间加成"
                data-percent='0'
                data-data="time_factor"
                @click="config"
              >修改</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  <!-- <div class="content">
      <div class="tittle">图表</div>
    <div id="main"></div>
    </div> -->
  <!-- </div> -->
</template>

<script >
import boss from "@/api/boss/boss";
var echarts = require("echarts");
export default {
  data() {
    return {
      // 初始化空对象
      chart: null,
      time: [],
      price: [],
      pool: [],
      profit: [],
      area: [],
      areaObj: {
        value: "0",
        text: "华南赛区"
      },
      setObj: {},
      money: {}
    };
  },
  methods: {
    render() {
      boss.getTodayData({ match_area: this.areaObj.value }).then(res => {
        if (res.errcode == 0) {
          this.money = res.data;
        }
      });
    },
    config(e) {
      let obj = e.target.dataset.data;
      let tittle = e.target.dataset.tittle;
      this.dialog = this.$createDialog({
        type: "prompt",
        title: `${e.target.dataset.tittle}`,
        prompt: {
          value: "",
          placeholder: `请修改${e.target.dataset.tittle}${
            e.target.dataset.percent ? "单位为%" : " "
          }`,
          type: e.target.dataset.tittle == "赛区名称" ? "text" : "number"
        },
        onConfirm: (value, promptValue) => {
          boss
            .setMatchAreaInfo({
              areaid: this.setObj.areaid,
              [obj]:
                e.target.dataset.percent == 0 ? promptValue / 100 : promptValue
            })
            .then(res => {
              if (res.errcode == 0) {
                this.setArea();
                this.$createToast({
                  type: "correct",
                  time: 2000,
                  txt: `${tittle}修改成功`
                }).show();
              }
            });
        }
      }).show();
    },
    getArea() {
      boss.getMatchAreaInfo().then(res => {
        res.match_area_info.forEach(value => {
          this.area.push({
            text: value.areaname,
            value: value.areaid
          });
        });
      });
    },
    setArea() {
      boss.getMatchAreaInfo().then(res => {
        let area = res.match_area_info.find(value => {
          return this.areaObj.value == value.areaid;
        });
        this.setObj = area;
      });
    },
    chooseArea() {
      let data = this.area;
      if (!this.picker) {
        this.picker = this.$createPicker({
          title: "选择赛区",
          data: [data],
          onSelect: (val, index, text) => {
            this.areaObj = {
              text: text[0],
              value: val[0]
            };
            this.draw("main");
            this.setArea();
            this.render();
          }
        });
      }
      this.picker.show();
    },
    draw() {
      const that = this;
      this.pool = [];
      this.price = [];
      this.profit = [];
      this.time = [];
      boss
        .getHistoryData({ match_area: this.areaObj.value })
        .then(res => {
          if (res.errcode == 0) {
            res.history.forEach((item, index) => {
              this.time.push(
                `${item.tag.substring(0, 4)}-${item.tag.substring(
                  4,
                  6
                )}-${item.tag.substring(6, 8)}`
              );
              !item.data.totalbonus
                ? this.price.push("0")
                : this.price.push(item.data.totalpay / 100);
              !item.data.totalpay
                ? this.pool.push("0")
                : this.pool.push(item.data.totalbonus / 100);
              this.profit.push(
                (this.price[index] - this.pool[index]).toFixed(2)
              );
            });
          }
        })
        .then(() => {
          // 基于准备好的dom，初始化echarts实例
          var myChart = echarts.init(document.getElementById("main"));

          // 指定图表的配置项和数据
          var option = {
            title: {},

            tooltip: {},
            legend: {
              data: ["总报名费", "总奖池", "总利润"]
            },
            xAxis: {
              data: that.time
            },
            yAxis: {
              axisLabel: {
                formatter: function(value, index) {
                  value >= 1000 ? (value = value / 1000 + "k") : value;
                  return value;
                }
              }
            },
            series: [
              {
                name: "总报名费",
                type: "line",
                data: that.price
              },
              {
                name: "总奖池",
                type: "line",
                data: that.pool
              },
              {
                name: "总利润",
                type: "bar",
                data: that.profit
              }
            ],
            dataZoom: [
              {
                type: "slider",
                show: true,
                xAxisIndex: [0],
                start: 1,
                end: 100
              }
            ]
          };

          // 使用刚指定的配置项和数据显示图表。
          this.myChart.setOption(option);
        });
    }
  },
  components: {},
  created() {
    this.getArea();
    this.setArea();
    this.render();
  },
  mounted() {
    const that = this;
    this.myChart = echarts.init(document.getElementById("main"));
    this.$nextTick(function() {
      this.draw("main");
    });
    window.addEventListener("resize", function() {
      that.myChart.resize(); //初始化的
    });
    this.timer = setInterval(() => {
      boss.getTodayData({ match_area: this.areaObj.value }).then(res => {
        if (res.errcode == 0) {
          console.log(res.data);
          this.money = res.data;
        }
      });
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>

<style scoped lang="less">
@import "../../static/css/1px.less";
.dataView {
  .in {
    color: #ff5544;
  }
  .config {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 40px;
    .bd {
      height: 130px;
      .border-b(#dcdcdc, solid);
      div.fl {
        height: 100%;
        width: 50%;
        padding: 30px 18px 0 30px;
        .ccc {
          font-size: 24px;
          color: #999;
          text-align: left;
          margin-top: 20px;
        }
        .blue {
          color: #0bc3ff;
          font-size: 24px;
          float: right;
        }
        div {
          color: #222;
          font-size: 28px;
        }
      }
    }

    .bl {
      .border-r(#dcdcdc, solid);
    }
  }
  .cubeic-select {
    float: right;
    // margin-left: 10px;
    line-height: 62px;
  }
  @media screen and (orientation: landscape) {
    transform: rotate(0);
    transform-origin: 0 0;
  }

  padding: 80px 30px 0 30px;
  height: 100%;
  background-color: #f5f5f5;
  #main {
    box-sizing: border-box;
    margin-bottom: 64px;
    // padding: 20px;
    @media screen and (orientation: landscape) {
      /*横屏 css*/
      height: 100%;
    }
    width: 690px;
    height: 470px;

    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
  }
  header {
    width: 100%;
    height: 70px;
    margin-bottom: 50px;
    // position: relative;
    .aerabox {
      width: 490px;
      margin: 0 auto;
    }
    .lfetArea {
      margin-right: 20px;
    }
    .rightArea {
      margin-left: 30px;
    }
    .area {
      width: 374px;
      height: 70px;
      border-radius: 35px;
      background-color: #fff;
      color: #0bc3ff;
      padding: 8px;
      div {
        font-size: 32px;
        font-weight: bold;
        border-radius: 27px;
        overflow: hidden;
        width: 178px;
        height: 54px;
        line-height: 60px;
      }
      .current {
        color: #fff;
        background-color: #0bc3ff;
        line-height: 54px;
      }
      display: flex;
      justify-content: space-around;
      line-height: 70px;
      text-align: center;
      .border-all(#0cbfff, solid, 70px);
    }
    .small {
      width: 5px;
      height: 17px;
      margin-top: 30px;
      background: linear-gradient(
        90deg,
        rgba(0, 242, 254, 1),
        rgba(12, 191, 255, 1)
      );
      border-radius: 3px;
    }
    .big {
      width: 5px;
      height: 23px;
      margin-top: 26px;
      background: linear-gradient(
        90deg,
        rgba(0, 242, 254, 1),
        rgba(12, 191, 255, 1)
      );
      border-radius: 3px;
    }
    .left {
      transform: rotate(45deg);
      margin-right: 10px;
    }
    .right {
      margin-right: 10px;
      transform: rotate(-45deg);
    }
  }
  .tittle {
    font-size: 32px;
    margin-bottom: 36px;
    font-weight: bold;
  }
  .inner {
    .content {
      color: #222;
      .box {
        height: 100%;
        min-height: 140px;
        background: rgba(255, 255, 255, 1);
        border-radius: 8px;
        margin-bottom: 64px;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
  }
  .b22 {
    font-style: 32px;
    color: #222;
    text-align: center;
  }
  .ccc {
    margin-top: 18px;
    color: #999;
    text-align: center;
    font-size: 24px;
  }
}
</style>
<style>
.cube-picker-confirm,
.cube-dialog-btn_highlight {
  color: #0cbfff !important;
}
</style>

