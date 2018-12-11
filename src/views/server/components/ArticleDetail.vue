<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :className="'sub-navbar '+postForm.status">
        <!-- <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" />-->
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >{{this.isEdit?"修改":"创建" }}</el-button>
        <!-- <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button> -->
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <!-- <Warning /> -->
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">标题</MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="45px" label="作者:" class="postInfo-container-item">
                    <el-input
                      type="textarea"
                      class="article-textarea"
                      :rows="1"
                      autosize
                      placeholder="请输入内容"
                      v-model="postForm.author"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="80px" label="时间:" class="postInfo-container-item">
                    <el-date-picker
                      v-model="postForm.date"
                      type="datetime"
                      format="yyyy-MM-dd"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="状态">
                    <el-select
                      class="filter-item"
                      v-model="postForm.status"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="tag">
                    <el-select
                      class="filter-item"
                      v-model="postForm.tag"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in tagOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="关联游戏">
                    <el-select
                      class="filter-item"
                      v-model="postForm.matchid"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in matchs"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="8">
                  <el-form-item label-width="60px" label="重要性:" class="postInfo-container-item">
                    <el-rate style="margin-top:8px;" v-model="postForm.importance" :max='3' :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :low-threshold="1"
                      :high-threshold="3">
                    </el-rate>
                  </el-form-item>
                </el-col>-->
              </el-row>
            </div>
          </el-col>
        </el-row>

        <!-- <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.content_short">
          </el-input>
          <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
        </el-form-item>-->
        <!-- <div class="editor-container">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="postForm.content">
          </el-input>
        </div>-->
        <div class="editor-container">
          <Tinymce :height="400" ref="editor" v-model="postForm.content"/>
        </div>
        <div class="editor-content" v-html="postForm.content"></div>

        <!-- <div style="margin-bottom: 20px;">
          <Upload v-model="postForm.image_uri" />
        </div>-->
      </div>
    </el-form>
  </div>
</template>

<script>
import "./zh_CN.js";
import Tinymce from "@/components/Tinymce";
import Upload from "@/components/Upload/singleImage3";
import MDinput from "@/components/MDinput";
import Multiselect from "vue-multiselect"; // 使用的一个多选框组件，element-ui的select不能满足所有需求
import "vue-multiselect/dist/vue-multiselect.min.css"; // 多选框组件css
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validateURL } from "@/utils/validate";
import { fetchArticle, createArticle, updateArticle } from "@/api/article";
// import { userSearch } from "@/api/remoteSearch";
import Warning from "./Warning";
import {
  CommentDropdown,
  PlatformDropdown,
  SourceUrlDropdown
} from "./Dropdown";

const defaultForm = {
  status: 0,
  title: "", // 文章题目
  content: "", // 文章内容
  date: undefined, // 时间
  id: undefined
};

export default {
  name: "articleDetail",
  components: {
    Tinymce,
    MDinput,
    Upload,
    Multiselect,
    Sticky,
    Warning,
    CommentDropdown,
    PlatformDropdown,
    SourceUrlDropdown
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error"
        });
        callback(null);
      } else {
        callback();
      }
    };
    // const validateSourceUri = (rule, value, callback) => {
    //   if (value) {
    //     if (validateURL(value)) {
    //       callback();
    //     } else {
    //       this.$message({
    //         message: "外链url填写不正确",
    //         type: "error"
    //       });
    //       callback(null);
    //     }
    //   } else {
    //     callback();
    //   }
    // };
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        // image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
        // source_uri: [{ validator: validateSourceUri, trigger: "blur" }]
      },
      statusOptions: [
        {
          label: "正常",
          value: 0
        },
        {
          label: "关闭",
          value: 1
        }
      ],
      tagOptions: [
        {
          label: "热门",
          value: 1
        },
        {
          label: "置顶",
          value: 2
        }
      ],
      matchs: []
    };
  },
  computed: {
    contentShortLength() {
      return this.postForm.content.length;
    }
  },
  created() {
    if (this.isEdit) {
      this.fetchData;
      this.postForm = Object.assign({}, this.$route.params);
      this.matchs = this.postForm.matchs;
      // const id = this.$route.params && this.$route.params.id;
      this.fetchData(this.postForm.id);
      console.log("postForm:", this.postForm);
    } else {
      this.matchs = this.$route.params.matchs;
      this.postForm = Object.assign({}, defaultForm);
    }
  },
  methods: {
    fetchData(id) {
      fetchArticle(id)
        .then(response => {
          this.postForm = response.data[0];
          // Just for test
          // this.postForm.title += `   Article Id:${this.postForm.id}`;
          // this.postForm.content_short += `   Article Id:${this.postForm.id}`;
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm() {
      console.log(this.postForm);
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.isEdit) {
            updateArticle(this.postForm).then(res => {
              if (res.code === 200) {
                this.$router.push({ name: "文章" });
                this.$message.success("操作成功");
              } else {
                this.$message.error("标题重复");
              }
              this.loading = false;
            });
          } else {
            createArticle(this.postForm).then(res => {
              if (res.code === 200) {
                this.$router.push({ name: "文章" });
                this.$message.success("操作成功");
              } else {
                this.$message.error("标题重复");
              }
              this.loading = false;
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    draftForm() {
      if (
        this.postForm.content.length === 0 ||
        this.postForm.title.length === 0
      ) {
        this.$message({
          message: "请填写必要的标题和内容",
          type: "warning"
        });
        return;
      }
      this.$message({
        message: "保存成功",
        type: "success",
        showClose: true,
        duration: 1000
      });
      this.postForm.status = "draft";
    }
    // getRemoteUserList(query) {
    //   userSearch(query).then(response => {
    //     if (!response.data.items) return;
    //     this.userListOptions = response.data.items.map(v => v.name);
    //   });
    // }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
