<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="标题">
          <el-input placeholder="标题" v-model="listQuery.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search"  @click="handleFilter">搜索</el-button>
          <!-- <router-link class="link-type" :to="'/server/createArticle'"> -->
            <el-button
              type="success"
              icon="el-icon-circle-plus" style="margin-left: 0" @click="addpath({})">新增</el-button>
          <!-- </router-link> -->
           <!-- <el-button
              type="success"
              @click="handleCreate" icon="el-icon-circle-plus" style="margin-left: 0">新增</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="日期">
        <template slot-scope="scope">
          <span>{{scope.row.date}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="关联比赛">
        <template slot-scope="scope">
          <span>{{scope.row.matchname}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"  min-width="150" label="配图" prop = "image">
        <template slot-scope="scope">
          <img class="link-type" @click="handleUpload(scope.row)" :src="scope.row.image" width="40" height="40"/>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="TAG">
        <template slot-scope="scope">
          <el-tag  type="success" v-if="scope.row.tag == 1">热门</el-tag >
          <el-tag type="success" v-if="scope.row.tag == 2">置顶</el-tag >
        </template>
      </el-table-column>

      <!-- <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" icon-class="star" class="meta-item__icon" :key="n"></svg-icon>
        </template>
      </el-table-column> -->

      <el-table-column class-name="status-col" label="状态" align="center" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status === 0?"正常":"关闭"}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" align="center" label="标题">
        <template slot-scope="scope">

          <!-- <router-link class="link-type" :to="'/server/editArticle?id='+scope.row.id"> -->
            <span class="link-type"  @click="detailpath(scope.row)">{{ scope.row.title }}</span>
          <!-- </router-link> -->
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" prop= "ctime">
      </el-table-column>

      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <!-- <router-link :to="'/server/editArticle'"> -->
            <el-button type="primary" @click="detailpath(scope.row)" size="small" icon="el-icon-edit">编辑</el-button>
          <!-- </router-link> -->
          <el-button  size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="上传banner" :visible.sync="uploaddialogFormVisible">
      <el-form ref="dialogForm" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
          <el-upload
            class="upload"
            ref="upload"
            action=""
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeupload" 
            :file-list="fileList"
            :auto-upload="true"
            list-type="picture">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <!-- <el-progress v-show="showProgress" :text-inside="true" :stroke-width="15" :percentage="percentage"></el-progress> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploaddialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="uploadLogo">{{$t('table.confirm')}}</el-button>
        <!-- <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, del, upload, updateArticle } from "@/api/article";

export default {
  name: "articleList",
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        title: "",
        page: 1,
        limit: 10
      },
      matchs: [],
      uploaddialogFormVisible: false,
      fileList: [],
      file: {}
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getList();
  },
  methods: {
    detailpath(row) {
      row = Object.assign(row, { matchs: this.matchs });
      this.$router.push({ name: "编辑文章", params: row });
    },
    addpath(row) {
      row = Object.assign(row, { matchs: this.matchs });
      this.$router.push({ name: "创建文章", params: row });
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data[0];
        this.total = response.data[1][0].count;
        this.matchs = response.data[2];
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row); // copy obj
      const index = this.list.indexOf(row);
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          del(this.temp.id).then(res => {
            if (res.code == 200) {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1);
                  break;
                }
              }
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleUpload(row) {
      this.fileList = [];
      console.log("row", row);
      this.temp = Object.assign({}, row);
      this.file.name = row.title + "-image";
      if (row.image !== "" && row.image !== null) {
        this.file.url = row.image;
        this.fileList.push(this.file);
      }
      this.uploaddialogFormVisible = true;
    },
    beforeupload(file) {
      if (this.fileList.length === 1) {
        this.$message.error("只能上传一张图片哦~");
        return;
      }
      console.log("beforefile:", file);
      let param = new FormData(); // 创建form对象
      param.append("file", file, file.name); // file对象是 beforeUpload参数
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      upload(param).then(res => {
        if (res.code === 200 && res.data) {
          console.log(res);
          this.file = {};
          this.file.name = res.data.name;
          this.temp.logo = res.data.url;
          this.file.url = res.data.url;
          this.fileList.push(this.file);
          console.log("this.fileList:", this.fileList);
        }
      });
      return false;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      this.file.url = ""
    },
    handlePreview(file) {
      console.log(file);
    },
    uploadLogo() {
      this.temp.image = this.file.url;
      updateArticle(this.temp).then(res => {
        if (res.code == 200) {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v);
              this.list.splice(index, 1, this.temp);
              break;
            }
          }
          this.uploaddialogFormVisible = false;
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        }
      });
    },
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
