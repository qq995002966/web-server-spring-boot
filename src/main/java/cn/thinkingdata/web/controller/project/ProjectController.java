package cn.thinkingdata.web.controller.project;

import cn.thinkingdata.web.service.core.project.ProjectService;
import cn.thinkingdata.web.service.core.user.custom.outer.ReputationService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Xiaowu on 2016/8/8.
 */
@Controller
@RequestMapping(value = "/v1/project")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ReputationService reputationService;

    @RequestMapping(value = "/home/recom",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult homepageRecom(){
        return projectService.findHomePageRecom();
    }

    @RequestMapping(value = "/home/hot",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult homePageHot(@RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                  @RequestParam(value = "limit", required = false,defaultValue = "10") Integer limit){
        return projectService.findHomePageHot(index,limit);
    }

    @RequestMapping(value = "/baseinfo",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findProjectBaseInfo(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return projectService.findProjectBaseInfo(projectId);
    }

    @RequestMapping(value = "/gamefrom",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findProjectQuery(@RequestParam(value = "game_type", required = false) String gameType,
                                       @RequestParam(value = "detail_type", required = false) String detailType,
                                       @RequestParam(value = "tag_id", required = false) Integer tagId){
        return projectService.findProjectQuery(gameType,detailType,tagId);
    }

    @RequestMapping(value = "/radar/stat",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findProjectRadarStat(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return projectService.findProjectRadarStat(projectId);
    }

    @RequestMapping(value = "/user/recommend",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findUserRecommendProjects(){
        return projectService.findUserRecommendProjects();
    }

    @RequestMapping(value = "/appstore/classify",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findProjectAppstoreClassifyDim(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return projectService.findProjectAppstoreClassifyDim(projectId);
    }

    @RequestMapping(value = "/appstore/rank",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findProjectAppstoreRankDistri(@RequestParam(value = "data_date_start", required = false,defaultValue = "") String dataDateStart,
                                                    @RequestParam(value = "data_date_end", required = false,defaultValue = "") String dataSateEnd,
                                                    @RequestParam(value = "app_type", required = false,defaultValue = "") Integer appType,
                                                    @RequestParam(value = "list_type", required = false,defaultValue = "") Integer listType,
                                                    @RequestParam(value = "device_type", required = false,defaultValue = "") Integer deviceType,
                                                    @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return projectService.findProjectAppstoreRankDistri(projectId,dataDateStart,dataSateEnd,appType,listType,deviceType);
    }

    @RequestMapping(value = "/graph",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findProjectGraph(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return projectService.findProjectGraph(projectId);
    }

    @RequestMapping(value = "/tags",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findProjectTag(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return projectService.findProjectTag(projectId);
    }

    @RequestMapping(value = "/tag",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findProjectListByTag(@RequestParam(value = "tag_id", required = false,defaultValue = "0") Integer tagId){
        return projectService.findProjectListByTag(tagId);
    }

    @RequestMapping(value = "/search",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult searchProject(@RequestParam(value = "keyword", required = false) String keyword,
                                    @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                    @RequestParam(value = "limit", required = false,defaultValue = "10") Integer limit){
        return projectService.searchProject(keyword,index,limit);
    }

    @RequestMapping(value = "/reputation/search",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult ReputationSearch(@RequestParam(value = "keyword", required = false) String keyword,
                                       @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                       @RequestParam(value = "limit", required = false,defaultValue = "10") Integer limit){
        return reputationService.getReputationSearch(keyword,index,limit);
    }
}
