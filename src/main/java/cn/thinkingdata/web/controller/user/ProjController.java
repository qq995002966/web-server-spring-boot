package cn.thinkingdata.web.controller.user;

import cn.thinkingdata.web.service.core.user.custom.ChatInfoService;
import cn.thinkingdata.web.service.core.user.custom.CustomServiceService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Xiaowu on 2016/8/16.
 */
@Controller
@RequestMapping(value = "/v1/service/proj")
public class ProjController {

    @Autowired
    private CustomServiceService customServiceService;

    @Autowired
    private ChatInfoService chatInfoService;

    @RequestMapping(value = "/chatinfo/topwords",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetProjChatSentiTopwords(@RequestParam(value = "info_id", required = false,defaultValue = "0") Integer infoId){
        return chatInfoService.GetProjChatSentiTopwords(infoId);
    }

    @RequestMapping(value = "/chatinfo/attitude",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetProjChatAttitudeDistri(@RequestParam(value = "info_id", required = false,defaultValue = "0") Integer infoId){
        return chatInfoService.GetProjChatAttitudeDistri(infoId);
    }

    @RequestMapping(value = "/chatinfo/active",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetProjChatActiveUser(@RequestParam(value = "info_id", required = false,defaultValue = "0") Integer infoId){
        return chatInfoService.GetProjChatActiveUser(infoId);
    }

    @RequestMapping(value = "/chatinfo/topic",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetProjChatTopicSession(@RequestParam(value = "info_id", required = false,defaultValue = "0") Integer infoId,
                                              @RequestParam(value = "topic_id", required = false) String topicId,
                                              @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                              @RequestParam(value = "limit", required = false,defaultValue = "1000") Integer limit){
        return chatInfoService.GetProjChatTopicSession(infoId,topicId,index,limit);
    }

    @RequestMapping(value = "/chatinfo/keywords",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetChatKeywordsDistribute(@RequestParam(value = "info_id", required = false,defaultValue = "0") Integer infoId){
        return chatInfoService.GetChatKeywordsDistribute(infoId);
    }

    @RequestMapping(value = "/datasource",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult AddProjectDataSource(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId,
                                           @RequestParam(value = "forum_name_0", required = false) String name0,
                                           @RequestParam(value = "forum_url_0", required = false) String url0,
                                           @RequestParam(value = "forum_name_1", required = false) String name1,
                                           @RequestParam(value = "forum_url_1", required = false) String url1){
        return customServiceService.AddProjectDataSource(projectId,name0,url0,name1,url1);
    }

    @RequestMapping(value = "/wordsclassifys",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult AddGasWordsClassifys(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId,
                                           @RequestParam(value = "classify_name", required = false) String classify_name,
                                           @RequestParam(value = "words", required = false) String words){
        return customServiceService.AddGasWordsClassifys(projectId,classify_name,words);
    }

    @RequestMapping(value = "/userfollow",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult AddUserFollowProject(@RequestParam(value = "project_name", required = false) String projectName,
                                           @RequestParam(value = "project_type", required = false) Integer projectType,
                                           @RequestParam(value = "project_desc", required = false) String projectDesc,
                                           @RequestParam(value = "forum_name1", required = false) String forumName1,
                                           @RequestParam(value = "forum_url1", required = false) String forumUrl1,
                                           @RequestParam(value = "forum_name2", required = false) String forumName2,
                                           @RequestParam(value = "forum_url2", required = false) String forumUrl2){
        return customServiceService.AddUserFollowProject(projectName,projectType,projectDesc,forumName1,forumUrl1,forumName2,forumUrl2);
    }

    @RequestMapping(value = "/collection",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult UserProjectCollect(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId,
                                         @RequestParam(value = "action", required = false) String actionName){
        return customServiceService.UserProjectCollect(projectId,actionName);
    }

}
