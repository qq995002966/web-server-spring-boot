package cn.thinkingdata.web.controller.article;

import cn.thinkingdata.web.service.core.article.ArticleService;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.WebUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by Xiaowu on 2016/8/8.
 */
@Controller
@RequestMapping(value = "/v1/article")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @RequestMapping(value = "/home",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult homeList(@RequestParam(value = "main_class", required = false) String main_class,
                               @RequestParam(value = "sub_class", required = false) String sub_class,
                               @RequestParam(value = "topic_id", required = false) String topic_id,
                               @RequestParam(value = "keyword", required = false) String keyword,
                               @RequestParam(value = "data_date_start", required = false) String data_date_start,
                               @RequestParam(value = "data_date_end", required = false) String data_date_end,
                               @RequestParam(value = "order_by_field", required = false) String order_by_field,
                               @RequestParam(value = "order_type", required = false) String order_type,
                               @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                               @RequestParam(value = "limit", required = false,defaultValue = "10") Integer limit,
                               @RequestParam(value = "need_preview", required = false,defaultValue = "0") Integer need_preview,
                               @RequestParam(value = "title_only", required = false,defaultValue = "0") Integer title_only,
                               @RequestParam(value = "ignore_bad", required = false,defaultValue = "0") Integer ignore_bad,
                               @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return articleService.articleQuery(main_class,sub_class,topic_id,keyword,data_date_start,data_date_end,order_by_field,order_type,need_preview,title_only,ignore_bad,index,limit,projectId);
    }

    @RequestMapping(value = "/detail",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findArticleDetail(@RequestParam(value = "title", required = false,defaultValue = "") String title){
        return articleService.findArticleDetail(title);
    }

    @RequestMapping(value = "/related",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findArticleRelatedArticles(@RequestParam(value = "title", required = false,defaultValue = "") String title){
        return articleService.findArticleRelatedArticles(title);
    }

    @RequestMapping(value = "/classify",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findArticleClassifyCount(@RequestParam(value = "keyword", required = false,defaultValue = "") String keyword,
                                               @RequestParam(value = "data_date_start", required = false,defaultValue = "") String dataDateStart,
                                               @RequestParam(value = "data_date_end", required = false,defaultValue = "") String dataDateEnd,
                                               @RequestParam(value = "title_only", required = false,defaultValue = "0") Integer titleOnly,
                                               @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return articleService.findArticleClassifyCount(keyword,dataDateStart,dataDateEnd,titleOnly,projectId);
    }

}
