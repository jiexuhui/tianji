<template>
  <div class="app-container">
    <el-radio-group v-model="gameid" size="small"  style="width: 500px; margin-left:50px;"  @change="radioChange">
      <el-radio-button label="1">DOTA2</el-radio-button>
      <el-radio-button label="2">LOL</el-radio-button>
      <el-radio-button label="3">CS:GO</el-radio-button>
      <el-radio-button label="4">王者荣耀</el-radio-button>
    </el-radio-group>

    <div style="margin: 20px;"></div>
    <el-form
      :rules="rules"
      ref="dataForm"
      :model="temp"
      label-position="left"
      label-width="100px"
      style="width: 500px; margin-left:50px;"
    >
      <el-form-item label="选择比赛">
        <el-select
          clearable
          class="filter-item"
          v-model="temp.matchid"
          placeholder="请先选择比赛"
          @change="selectChange"
          style="width: 400px;"
        >
          <el-option
            v-for="item in matchList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="temp.price"></el-input>
      </el-form-item>
      <h2>买点</h2>
      <el-form-item label="*胜负" prop="point1" >
        <el-radio-group v-model="temp.point1" >
          <el-radio-button :label="smatch.ltname+':胜'" @click.native.prevent="point1change(smatch.ltname+':胜')">{{smatch.ltname}}胜</el-radio-button>
          <el-radio-button :label="smatch.rtname+':胜'" @click.native.prevent="point1change(smatch.rtname+':胜')">{{smatch.rtname}}胜</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="*击杀" prop="point2" >
          <el-checkbox-group v-model="temp.point2" >
            <el-checkbox v-for="item in silks2" :label="item" :key="item" border>{{item}}</el-checkbox>
          </el-checkbox-group>
      </el-form-item>
      <el-form-item label="*让分" prop="point3" >
         <el-radio-group v-model="temp.point3" >
          <el-radio-button v-for="item in silks3" :label="item" :key="item" @click.native.prevent="point3change(item)">{{item}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预测标题" prop="title">
        <el-input v-model="temp.title" placeholder="18个汉字以内" clearable></el-input>
      </el-form-item>
      <el-form-item label="基本面分析" prop="content">
        <el-input v-model="temp.content" placeholder="请阐述您预测观点的简要说明" clearable type="textarea"
  :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="大神观点" prop="viewpoints">
        <el-input v-model="temp.viewpoints" placeholder="请写下您的观点" clearable type="textarea"
  :rows="5"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer"  style="width: 500px; margin-left:50px;">
      <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
      <el-button
        type="primary"
        @click="createData"
      >{{$t('table.confirm')}}</el-button>
    </div>
  </div>
</template>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
<script>
import { add,matchList } from "@/api/pushcase";
import { parseTime } from "@/utils/index";
import waves from "@/directive/waves"; // 水波纹指令

export default {
  name: "complexTable",
  directives: {
    waves
  },
  data() {
    return {
      checkAll: false,
      gameid: 1,
      matchid: undefined,
      tableKey: 0,
      matchList: null,
      total: null,
      isIndeterminate: true,
      temp: {
        point1:'',
        point2: [],
        point3: '',
        price: 0,
        title: "",
        content: "",
        viewpoints: "",
        answer: "",
        answertypes: "",
        matchid: undefined
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入基本面分析", trigger: "blur" }],
        viewpoints: [{ required: true, message: "请输入大神观点", trigger: "blur" }]
      },
      smatch: {},
      silks2: [],
      silks3: [],
      points: []
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "success",
        1: "info"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getList();
  },
  methods: {
    radioChange(e) {
      console.log("e>>",e)
      this.gameid = e
      this.temp = {
        point1:'',
        point2: [],
        point3: '',
        price: 0,
        title: "",
        content: "",
        viewpoints: "",
        answer: "",
        answertypes: "",
        matchid: undefined
      }
      this.smatch = {},
      this.silks2 = [],
      this.silks3 = [],
      this.getList()
    },
    point1change(point1) {
      console.log("point1>>",point1)
       console.log("this.temp.point1111>>", this.temp.point1)
      this.temp.point1 = this.temp.point1 == point1?'':point1
      console.log("this.temp.point1>>",this.temp.point1)
      // this.points.push(point1)
    },
    point3change(point3) {
       console.log("point3>>",point3)
       console.log("this.temp.point3>>", this.temp.point3)
      this.temp.point3 = this.temp.point3 == point3?'':point3
      console.log("this.temp.point2333>>",this.temp.point3)
      // this.points.push(point3)
    },
    selectChange(row){
      console.log("row>>",row)
      this.matchid = row == ""?0:row
      this.temp = {
        point1:'',
        point2: [],
        point3: '',
        price: 0,
        title: "",
        content: "",
        viewpoints: "",
        answer: "",
        answertypes: "",
        matchid: undefined
      }
      this.silks2 = [],
      this.silks3 = [],
      matchList({gameid: this.gameid,matchid: this.matchid}).then(response => {
        this.smatch = response.data[0][0];
        this.temp.matchid = this.smatch.id
        console.log("smacth>>",this.smatch)
        this.smatch.silknames = this.smatch.silknames==null?[]:this.smatch.silknames.split(',')
        this.smatch.tsilks =  this.smatch.tsilks==null?[]:this.smatch.tsilks.split(',')
        this.smatch.tteams =  this.smatch.tteams==null?[]:this.smatch.tteams.split(',')
        for(const index in this.smatch.silknames) {
          const silk = {}
          const label =  (this.smatch.tteams[index]==1?this.smatch.ltname:this.smatch.rtname) + ":" + this.smatch.silknames[index] 
          if(this.smatch.tsilks[index]==2){
            this.silks2.push(label)
          }
          if(this.smatch.tsilks[index]==3){
            this.silks3.push(label)
          }
        }
        console.log("silk2>>",this.silks2)
        console.log("silk3>>",this.silks3)
        // this.listLoading = false;
      });
    },
    formatTime(time) {
      return parseTime(time);
    },
    getList() {
      this.listLoading = true;
      matchList({gameid: this.gameid,matchid: 0}).then(response => {
        this.matchList = response.data[0];
        const silks2 = []
        const silks3 = []
        // this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleCreate() {
      this.resetTemp();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var points = []
          if(this.temp.point1 != "") {
            points.push(this.temp.point1)
          }
          if(this.temp.point2.length>0) {
            points = points.concat(this.temp.point2)
          }
          if(this.temp.point3 != "") {
            points.push(this.temp.point3)
          }
          if(points.length==0) {
             this.$message.error("请选择买点");
          }
          console.log("points>>",points)
          this.temp.gameid = this.gameid
          this.temp.matchname = this.smatch.name
          this.temp.matchtime = this.smatch.matchtime
          this.temp.team1 = this.smatch.ltname
          this.temp.team2 = this.smatch.rtname
          this.temp.answer = points
          this.temp.answertypes = []
          console.log(this.temp);
          // return;
          add(this.temp).then(res => {
            if (res.code === 200) {
              this.$message.success("操作成功");
              this.dialogFormVisible = false;
            } 
          });
        }
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
