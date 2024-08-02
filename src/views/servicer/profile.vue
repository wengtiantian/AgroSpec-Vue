<template>
  <div class="margin-top">

    <h2 style="text-align: center; padding: 15px 0;">基本信息</h2>
    <el-descriptions :column="2" :size="size" border>
      <el-descriptions-item label="主体名称">
        {{ basicData.name }}
      </el-descriptions-item>

      <el-descriptions-item label="组织类型">
        <dict-tag :options="es_org_type" :value="basicData.typeId" />
      </el-descriptions-item>
      <el-descriptions-item label="联系人电话">
        {{ basicData.accountPhone }}
      </el-descriptions-item>
      <el-descriptions-item label="联系人">
        {{ basicData.corporate }}
      </el-descriptions-item>
      <el-descriptions-item label="经营状态">
        <dict-tag :options="es_manage_status" :value="basicData.manageForm" />
      </el-descriptions-item>
      <el-descriptions-item label="服务区域ID">
        {{ basicData.regionId }}
      </el-descriptions-item>
      <el-descriptions-item label="主体介绍">
        {{ basicData.introduce }}
      </el-descriptions-item>
      <el-descriptions-item label="Logo">
        <image-preview :src="basicData.logo" :width="50" :height="50" />
      </el-descriptions-item>
      <el-descriptions-item label="主体视频">
        <video :src="baseUrl + basicData.video" controls width="500" height="200"></video>
      </el-descriptions-item>
      <el-descriptions-item label="主体图片">
        <image-preview :src="basicData.pictureUrls" :width="100" :height="100" />
      </el-descriptions-item>
      <el-descriptions-item label="从业人数">
        {{ basicData.population }}人
      </el-descriptions-item>
      <el-descriptions-item label="年服务营业收入">
        {{ basicData.income }}万元
      </el-descriptions-item>
      <el-descriptions-item label="服务对象数">
        {{ basicData.serveNum }}个
      </el-descriptions-item>
      <el-descriptions-item label="服务小农户数">
        {{ basicData.farmersNum }}个
      </el-descriptions-item>
      <el-descriptions-item label="年服务面积">
        {{ basicData.serveArea }}亩
      </el-descriptions-item>
      <el-descriptions-item label="年畜牧服务量">
        {{ basicData.raiseNum }}头/只
      </el-descriptions-item>
      <el-descriptions-item label="年水产服务量">
        {{ basicData.waterNum }}尾
      </el-descriptions-item>
      <el-descriptions-item label="其他行业服务总量">
        {{ basicData.otherNum }}个
      </el-descriptions-item>
      <el-descriptions-item label="服务粮食作物面积">
        {{ basicData.cropArea }}亩
      </el-descriptions-item>
      <el-descriptions-item label="是否已准入">
        <div class="auth">
          <dict-tag :options="es_is_auth" :value="basicData.isAuth" />
          <el-button v-if="basicData.isAuth == 0" type="primary" link>申请准入
          </el-button>
        </div>

      </el-descriptions-item>
    </el-descriptions>

    <h2 style="text-align: center; padding: 15px 0;">服务质量评价 <el-rate v-model="sqInfo.score" disabled show-score
        text-color="#ff9900" score-template="{value} 分" /></h2>

    <div class="chart">
      <div class="pie" ref="chartDom"></div>
      <div class="pie" ref="chartDom2"></div>
    </div>


  </div>
</template>
  
<script setup>
import { getServicerByUserId } from '@/api/system/servicer'
import * as echarts from 'echarts';
const { proxy } = getCurrentInstance();

const { es_is_auth, es_org_type, es_manage_status } = proxy.useDict('es_is_auth', 'es_org_type', 'es_manage_status');
const baseUrl = import.meta.env.VITE_APP_BASE_API;
// 创建一个响应式引用来保存DOM元素
const chartDom = ref(null);
const chartDom2 = ref(null);

let chartInstance = null;
let chartInstance2 = null;

const data = reactive({
  basicData: {},
  sqInfo: {
    score: 4.2
  },
  queryParams: {},
  rules: {}
});

const { queryParams, basicData, rules, sqInfo } = toRefs(data);

function fetchServicerByUserId() {
  getServicerByUserId().then(response => {
    basicData.value = response.data;
  })
}


// 返回操作
const goBack = () => {
  // 返回逻辑
};




// 初始化ECharts实例并设置配置项（这里以折线图为例，但可灵活替换）
onMounted(async () => {
  await nextTick(); // 确保DOM已经渲染完成
  chartInstance = echarts.init(chartDom.value);
  chartInstance2 = echarts.init(chartDom2.value);

  const option = {
    // 这里是ECharts的配置项，可以根据需要绘制不同类型的图表
    title: {
      text: '服务质量评价变化曲线',
      left: 'center'

    },
    tooltip: {},
    xAxis: {
      data: ["2月", "3月", "4月", "5月", "6月"]
    },
    yAxis: {},
    series: [{
      name: '数据系列',
      type: 'line', // 这里可以是'line'、'bar'、'pie'等，根据图表类型选择
      data: [5, 4, 5, 3, 5]
    }]
  };
  chartInstance.setOption(option);



  const option2 = {
    title: {
      text: '评价分布',
      subtext: '实时数据',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '评价分布',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '好评' },
          { value: 100, name: '差评' },

        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  option2 && chartInstance2.setOption(option2);


});


// 销毁ECharts实例
onUnmounted(() => {
  if (chartInstance != null && chartInstance.dispose) {
    chartInstance.dispose();
  }
});

fetchServicerByUserId()

</script>
  
<style>
.margin-top {
  width: 80%;
  margin: 0 auto;
}

/* 可以根据需要添加样式 */
.pie {
  height: 300px;
  width: 50%;

}

.chart {
  display: flex;
}

.auth {
  display: flex;
}
</style>
  