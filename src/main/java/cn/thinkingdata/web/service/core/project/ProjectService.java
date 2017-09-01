package cn.thinkingdata.web.service.core.project;

import cn.thinkingdata.web.constant.SessionAttr;
import cn.thinkingdata.web.domain.appstore.Do_gas_apps_history_ratings;
import cn.thinkingdata.web.domain.appstore.Do_gas_rating_info;
import cn.thinkingdata.web.domain.gas.Do_gas_projects;
import cn.thinkingdata.web.domain.project.Do_proj_graph_relation;
import cn.thinkingdata.web.domain.project.Do_project_hot_list;
import cn.thinkingdata.web.domain.project.Do_project_radar_stat;
import cn.thinkingdata.web.domain.project.Do_project_tag_dim;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.domain.user.Do_user_recommend_projects;
import cn.thinkingdata.web.persistence.appstore.Mapper_gas_apps_history_ratings;
import cn.thinkingdata.web.persistence.appstore.Mapper_gas_rating_info;
import cn.thinkingdata.web.persistence.gas.Mapper_gas_project_tag;
import cn.thinkingdata.web.persistence.gas.Mapper_gas_projects;
import cn.thinkingdata.web.persistence.project.Mapper_proj_graph_relation;
import cn.thinkingdata.web.persistence.project.Mapper_project_competing_products;
import cn.thinkingdata.web.persistence.project.Mapper_project_hot_list;
import cn.thinkingdata.web.persistence.project.Mapper_project_radar_stat;
import cn.thinkingdata.web.persistence.user.Mapper_user;
import cn.thinkingdata.web.persistence.user.Mapper_user_recommend_projects;
import cn.thinkingdata.web.service.cache.ProjectInfoCacheService;
import cn.thinkingdata.web.util.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.PrintWriter;
import java.util.*;

/**
 * Created by Xiaowu on 2016/8/8.
 */
@Service
public class ProjectService {

    @Autowired
    private ProjectInfoCacheService projectInfoCacheService;

    @Autowired
    private Mapper_project_hot_list mapper_project_hot_list;

    @Autowired
    Mapper_project_competing_products mapper_project_competing_products;

    @Autowired
    Mapper_gas_project_tag mapper_gas_project_tag;

    @Autowired
    Mapper_user mapper_user;

    @Autowired
    Mapper_gas_projects mapper_gas_projects;

    @Autowired
    private Mapper_project_radar_stat mapper_project_radar_stat;

    @Autowired
    private Mapper_user_recommend_projects m_mapper_user_recommend_projects;

    @Autowired
    Mapper_gas_apps_history_ratings mapper_gas_apps_history_ratings;

    @Autowired
    private Mapper_gas_rating_info mapper_gas_rating_info;

    @Autowired
    private Mapper_proj_graph_relation mapper_proj_graph_relation;

    private static final int TOP_NUM = 5;

    private static final int MAX_COMPETING_GAME_NUM = 8;
    
    private static final int PROJECT_VIEW_HISTORY_NUM = 18;

    public DataResult findHomePageRecom() {
        List<Do_gas_projects> projectList = new ArrayList<>(projectInfoCacheService.getGasProjectsList());
        Collections.sort(projectList, new Comparator<Do_gas_projects>() {
            @Override
            public int compare(Do_gas_projects o1, Do_gas_projects o2) {
                return o2.getHot_score().compareTo(o1.getHot_score());
            }

        });
        Set<Integer> usedIndexSet = new HashSet<>();
        List<Integer> recomProjectList = new ArrayList<>();
        Random random = new Random();
        while(recomProjectList.size() < 6){
            int index = random.nextInt(100);
            if(!usedIndexSet.contains(index)){
                recomProjectList.add(projectList.get(index).getProject_id());
                usedIndexSet.add(index);
            }
        }

        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("recommend_project_list", recomProjectList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findHomePageHot(Integer index,Integer limit) {
        List<Do_project_hot_list> hotList = mapper_project_hot_list.getProjectHotList(index, limit);
        List<Integer> hotProjectIdList = new ArrayList<>();
        for(Do_project_hot_list hot_project : hotList){
            hotProjectIdList.add(hot_project.getProject_id());
        }
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("hot_project_list", hotProjectIdList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findProjectBaseInfo(Integer projectId) {
        refreshViewHistoryProjects(projectId);
        Do_gas_projects projectInfo = mapper_gas_projects.getProjectById(projectId);
        String competingProjectsStr = mapper_project_competing_products.getCompetingProjects(projectId);
        Map<String, Object> resultMap = new LinkedHashMap<>();
        resultMap.put("author", projectInfo.getAuthor());
        resultMap.put("distributor", projectInfo.getDistributor());
        resultMap.put("game_type", projectInfo.getGame_type());
        resultMap.put("release_date", projectInfo.getRelease_date());
        resultMap.put("overview", projectInfo.getOverview());
        resultMap.put("hot_rank", projectInfo.getHot_rank());
        resultMap.put("hot_rank_yesterday", projectInfo.getHot_rank_yesterday());
        resultMap.put("forum_content_num", projectInfo.getForum_content_num());
        List tagList = projectInfoCacheService.getTagListByProjectId(projectId.toString());
        resultMap.put("tag_list", tagList);
        List<Integer> competingProjectList = new ArrayList<>();
        if(competingProjectsStr != null){
            String competingProjects[] = competingProjectsStr.split(",");
            int competingNum = Math.min(MAX_COMPETING_GAME_NUM, competingProjects.length);
            for(int i = 0; i < competingNum; i++){
                competingProjectList.add(Integer.parseInt(competingProjects[i]));
            }
        }
        resultMap.put("competing_list", competingProjectList);

        return new DataResult(ReturnCodeDim.SUCCESS, resultMap);
    }

    public DataResult findProjectRadarStat(Integer projectId) {
        Map<String, Object> dataMap = new LinkedHashMap<>();
        Map<String, Object> result = new LinkedHashMap<>();
        Do_project_radar_stat do_project_radar_stat = mapper_project_radar_stat.getGameRadar(projectId);
        if(do_project_radar_stat == null){
            return new DataResult(ReturnCodeDim.DATA_NOT_PREPARED,"");
        }
        Map map = mapper_project_radar_stat.getGameAvg(projectId);
        int total = Integer.parseInt(map.get("total").toString());
        String type = map.get("game_type").toString();
        result.put("avg",transforMap(total,map));
        dataMap.put("user_weight",getRadarValue(total,do_project_radar_stat.getUser_rank()));
        dataMap.put("post_weight",getRadarValue(total,do_project_radar_stat.getPost_rank()));
        dataMap.put("negative_weight",getRadarValue(total,do_project_radar_stat.getNegative_rank()));
        dataMap.put("stable_weight",getRadarValue(total,do_project_radar_stat.getStable_rank()));
        dataMap.put("useless_weight",getRadarValue(total,do_project_radar_stat.getUser_rank()));
        if(type.equals("S")){
            dataMap.put("appstore_weight",getRadarValue(total,do_project_radar_stat.getAppstore_rank()));
        }
        result.put("real",dataMap);
        return new DataResult(ReturnCodeDim.SUCCESS, result);
    }

    public void refreshViewHistoryProjects(Integer m_project_id){
        LinkedList<Integer> projectList = new LinkedList<>();
        Do_user userDo = WebUtil.getCurrentUser();
        if(userDo != null){
            String projectIdStr = userDo.getProjects_id();
            if(projectIdStr.length() > 0){
                String projectIds[] = projectIdStr.split(",");
                for(String projectId : projectIds){
                    projectList.add(Integer.parseInt(projectId));
                }
                while(true){
                    boolean flag = projectList.removeFirstOccurrence(m_project_id);
                    if(flag == false){
                        break;
                    }
                }
            }
            projectList.addFirst(m_project_id);
            int projectListLength = Math.min(PROJECT_VIEW_HISTORY_NUM, projectList.size());
            List<Integer> newProjectList = projectList.subList(0, projectListLength);
            String newProjectIdStr = StringUtils.join(newProjectList, ",");
            userDo.setProjects_id(newProjectIdStr);
            WebUtil.saveCurrentUser(userDo);
            mapper_user.updateProjectsId(userDo.getUser_id(), newProjectIdStr);
        }else{
            String tempHistoryProjectStr = (String) WebUtil.getSession(SessionAttr.TEMP_PROJECT_HISTORY);
            if(tempHistoryProjectStr == null){
                tempHistoryProjectStr = "";
            }
            if(tempHistoryProjectStr.length() > 0){
                String projectIds[] = tempHistoryProjectStr.split(",");
                for(String projectId : projectIds){
                    projectList.add(Integer.parseInt(projectId));
                }
                while(true){
                    boolean flag = projectList.removeFirstOccurrence(m_project_id);
                    if(flag == false){
                        break;
                    }
                }
            }
            projectList.addFirst(m_project_id);
            int projectListLength = Math.min(PROJECT_VIEW_HISTORY_NUM, projectList.size());
            List<Integer> newProjectList = projectList.subList(0, projectListLength);
            String newProjectIdStr = StringUtils.join(newProjectList, ",");
            WebUtil.setSession(SessionAttr.TEMP_PROJECT_HISTORY, newProjectIdStr);
        }

    }

    private Map transforMap(int total,Map map){
        Map result = new HashMap();
        result.put("user_weight",getRadarValue(total,map.get("user_rank")));
        result.put("post_weight",getRadarValue(total,map.get("post_rank")));
        result.put("negative_weight",getRadarValue(total,map.get("negative_rank")));
        result.put("stable_weight",getRadarValue(total,map.get("stable_rank")));
        result.put("useless_weight",getRadarValue(total,map.get("useless_rank")));
        if(map.get("game_type").toString().equals("S")){
            result.put("appstore_weight",getRadarValue(total,map.get("appstore_rank")));
        }
        return result;
    }

    /**
     *（1-当前位置/总数）*0.8+0.2
     */
    private Double getRadarValue(int total,Object value){
        return (1-Double.parseDouble(value.toString())/total)*0.8+0.2;
    }

    public DataResult findUserRecommendProjects() {
        List<Do_user_recommend_projects> recommendProjList = new ArrayList<>();
        Do_user userInfo = WebUtil.getCurrentUser();
        if(userInfo != null){
            recommendProjList = m_mapper_user_recommend_projects.getByUserId(userInfo.getUser_id());
        }else{
            List<Do_project_hot_list> hotList = mapper_project_hot_list.getProjectHotList(0, 40);
            float score = 5 * hotList.size();
            for(Do_project_hot_list hotProject : hotList){
                Do_user_recommend_projects recommendProj = new Do_user_recommend_projects();
                recommendProj.setProject_id(hotProject.getProject_id());
                recommendProj.setScore(score);
                recommendProj.setUser_id(0);
                score -= 5;
                recommendProjList.add(recommendProj);
            }
        }
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("get", recommendProjList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findProjectAppstoreClassifyDim(Integer projectId) {
        List<Integer> gameTypeDimList = mapper_gas_apps_history_ratings.getGameTypeDimList(projectId);
        List<Integer> listTypeDimList = mapper_gas_apps_history_ratings.getListTypeDimList(projectId);
        List<Integer> deviceTypeDimList = mapper_gas_apps_history_ratings.getDeviceTypeDimList(projectId);
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("game_type_dim", gameTypeDimList);
        dataMap.put("list_type_dim", listTypeDimList);
        dataMap.put("device_type_dim", deviceTypeDimList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findProjectAppstoreRankDistri(Integer m_project_id, String data_date_start, String data_date_end, Integer appType, Integer listType, Integer deviceType) {
        List<Do_gas_apps_history_ratings> projectDateRatingList = mapper_gas_apps_history_ratings.getProjectAppstoreRatingList(m_project_id, data_date_start, data_date_end, appType, listType, deviceType);
        List<Do_gas_rating_info> appstoreTypeRatingList = mapper_gas_rating_info.getAppstoreTopRatingByDetailType(DateUtil.getOffsetDatePartitionString(new Date(), -1), appType, deviceType, listType, 0,TOP_NUM);
        List<Map<String, Object>> dateDistriList = new ArrayList<>();
        for(Do_gas_apps_history_ratings do_date_distri : projectDateRatingList){
            String dataDate = do_date_distri.getData_date();
            int rank = do_date_distri.getRank();
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("data_date", dataDate);
            map.put("rank", rank);
            dateDistriList.add(map);
        }
        List<Map<String, Object>> topAppList = new ArrayList<>();
        for(Do_gas_rating_info do_app_rating : appstoreTypeRatingList){
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("rank", do_app_rating.getRank());
            map.put("app_name", do_app_rating.getApp_name());
            map.put("app_author", do_app_rating.getApp_author());
            map.put("app_img", do_app_rating.getApp_img());
            Integer projectId = projectInfoCacheService.getProjectByAppId(do_app_rating.getApp_id());
            if(projectId != null){
                map.put("project_id", projectId);
            }
            topAppList.add(map);
        }
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("rank_date_distri", dateDistriList);
        dataMap.put("top_apps", topAppList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findProjectGraph(Integer projectId) {
        Integer[] m_project_id = {projectId};
        List<Do_proj_graph_relation> graphProjectList = mapper_proj_graph_relation.getRelatedProjectList(m_project_id,10);
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("tag_list",this.findProjectTagByProjectId(projectId));
        Map<String,Map<String,Object>> graphProjectMapList= new HashMap<>();
        Integer[] inStr = new Integer[9];
        int index = 0;
        Set<Integer> projectIds = new HashSet<>();
        projectIds.add(projectId);
        for (Do_proj_graph_relation projGraphRelation : graphProjectList) {
            Map<String,Object> map = new HashMap<>();
            projectIds.add(projGraphRelation.getRelate_project_id());
            map.put("project_id",projGraphRelation.getRelate_project_id());
            map.put("relation_name",projGraphRelation.getRelation_name());
            map.put("relate_index",projGraphRelation.getRelate_index());
            map.put("hot_score",projGraphRelation.getHot_score());
            map.put("tag_list",this.findProjectTagByProjectId(projGraphRelation.getRelate_project_id()));
            graphProjectMapList.put(projGraphRelation.getRelate_project_id().toString(),map);
            inStr[index++] = projGraphRelation.getRelate_project_id();
        }
        List<Do_proj_graph_relation> graphProjectLists = mapper_proj_graph_relation.getRelatedProjectList(inStr,36);
        Integer[] inChildStr = new Integer[27];
        index = 0;
        Set set = graphProjectMapList.keySet();
        for (Object o : set) {
            Map<String, Object> parentNode = graphProjectMapList.get(o);
            List childNodes = (List) parentNode.get("relate_project");
            if (null == childNodes) {
                childNodes = new ArrayList();
            }
            if (childNodes.size() > 2) {
                continue;
            }
            for (Do_proj_graph_relation projGraphRelation : graphProjectLists) {
                if(!projectIds.contains(projGraphRelation.getRelate_project_id())) {
                    Map<String, Object> childMap = new HashMap<>();
                    childMap.put("project_id", projGraphRelation.getRelate_project_id());
                    childMap.put("relation_name", projGraphRelation.getRelation_name());
                    childMap.put("relate_index", projGraphRelation.getRelate_index());
                    childMap.put("hot_score", projGraphRelation.getHot_score());
                    childMap.put("tag_list", this.findProjectTagByProjectId(projGraphRelation.getRelate_project_id()));
                    if (childNodes.size() > 2) {
                        break;
                    }
                    childNodes.add(childMap);
                    inChildStr[index++] = projGraphRelation.getRelate_project_id();
                    projectIds.add(projGraphRelation.getRelate_project_id());
                }
            }
            parentNode.put("relate_project", childNodes);
            graphProjectMapList.put(o.toString(), parentNode);
        }
        graphProjectLists = mapper_proj_graph_relation.getRelatedProjectList(inChildStr,81);
        set = graphProjectMapList.keySet();
        for (Object o : set) {
            Map<String, Object> rootNode = graphProjectMapList.get(o);
            List list = (List) rootNode.get("relate_project");
            List parents = new ArrayList();
            for (Object obj : list) {
                Map parent = (Map) obj;
                for (Do_proj_graph_relation projGraphRelation : graphProjectLists) {
                    if(!projectIds.contains(projGraphRelation.getRelate_project_id())) {
                        if (parent.get("project_id").toString().equals(projGraphRelation.getProject_id().toString())) {
                            Map<String, Object> childMap = new HashMap<>();
                            childMap.put("project_id", projGraphRelation.getRelate_project_id());
                            childMap.put("relation_name", projGraphRelation.getRelation_name());
                            childMap.put("relate_index", projGraphRelation.getRelate_index());
                            childMap.put("hot_score", projGraphRelation.getHot_score());
                            childMap.put("tag_list", this.findProjectTagByProjectId(projGraphRelation.getRelate_project_id()));
                            List childNodes = (List) parent.get("relate_project");
                            if (null == childNodes) {
                                childNodes = new ArrayList();
                            }
                            if (childNodes.size() > 2) {
                                break;
                            }
                            childNodes.add(childMap);
                            parent.put("relate_project", childNodes);
                            projectIds.add(projGraphRelation.getRelate_project_id());
                        }
                    }
                }
                if(!parents.contains(parent)){
                    parents.add(parent);
                }
            }
            rootNode.put("relate_project", parents);
            graphProjectMapList.put(o.toString(), rootNode);
        }
        dataMap.put("child",graphProjectMapList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    private List findProjectTagByProjectId(Integer projectId){
        List tagList = projectInfoCacheService.getTagListByProjectId(projectId.toString());
        if( null != tagList){
            Map<String, Object> resultMap = new LinkedHashMap<>();
            resultMap.put("tag_list", tagList);
            return tagList;
        }else {
            return null;
        }
    }

    public DataResult findProjectTag(Integer projectId) {
        List tagList = findProjectTagByProjectId(projectId);
        Map<String, Object> resultMap = new LinkedHashMap<>();
        resultMap.put("tag_list", tagList);
        return new DataResult(ReturnCodeDim.SUCCESS, resultMap);
    }

    public DataResult findProjectListByTag(Integer tagId) {
        List<Integer> projectIdList = mapper_gas_project_tag.getProjectIDListByTag(tagId);
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("project_list", projectIdList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult searchProject(String keyword, Integer index, Integer limit) {
        List<Do_gas_projects> projectTotalList = getAllProjectsBySearchKeyword(keyword);
        int fromIndex = index;
        int endIndex = Math.min(index + limit, projectTotalList.size());
        List<Do_gas_projects> subProjectList = projectTotalList.subList(fromIndex, endIndex);
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("total", projectTotalList.size());
        List<Map<String, Object>> projectDataList = new ArrayList<>();
        for(Do_gas_projects projectDo : subProjectList){
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("project_id", projectDo.getProject_id());
            map.put("project_name", projectDo.getProject_name());
            map.put("author", projectDo.getAuthor());
            map.put("distributor", projectDo.getDistributor());
            map.put("game_type", getGameType(projectDo));
            map.put("hot_rank", projectDo.getHot_rank());
            map.put("article_num", projectDo.getArticle_num());
            map.put("forum_content_num", projectDo.getForum_content_num());
            map.put("channel_content_num", projectDo.getChannel_content_num());
            map.put("tag_list", projectInfoCacheService.getTagListByProjectId(projectDo.getProject_id().toString()));
            projectDataList.add(map);
        }
        dataMap.put("project_list", projectDataList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    private List<Do_gas_projects> getAllProjectsBySearchKeyword(String keywordStr){
        LinkedHashSet<Do_gas_projects> projectResultSet = new LinkedHashSet<>();
        String[] keywords = keywordStr.split(",");
        if(keywords.length>1){
            LinkedHashSet<Do_gas_projects> projectSet = new LinkedHashSet<>();
            for(String keyword : keywords){
                projectSet.addAll(searchProjectByTag(keyword));
                projectSet.addAll(searchProjectByName(keyword));
            }
            for(Do_gas_projects gasProjects : projectSet){
                String tags =  gasProjects.getProject_name()+ "/t"+gasProjects.getAuthor() + "/t"+gasProjects.getGame_type()+"/"+gasProjects.getDistributor();
                List<Integer> tagIds = projectInfoCacheService.getTagListByProjectId(gasProjects.getProject_id().toString());
                List<Do_project_tag_dim> project_tag_dims = projectInfoCacheService.getAllProjectTagList();
                for(Do_project_tag_dim gasProjectTag : project_tag_dims){
                    if(tagIds.contains(gasProjectTag.getTag_id())){
                        tags += "/t" + gasProjectTag.getTag_name();
                    }
                }
                if(tags.contains(keywords[0])&&tags.contains(keywords[1])){
                    projectResultSet.add(gasProjects);
                }
            }
        }else {
            projectResultSet.addAll(searchProjectByTag(keywordStr));
            projectResultSet.addAll(searchProjectByName(keywordStr));
        }
        List<Do_gas_projects> resultList = new ArrayList<>();
        resultList.addAll(projectResultSet);
        return resultList;
    }

    private List<Do_gas_projects> searchProjectByName(String keyword, LinkedHashSet<Do_gas_projects> projectTagSet) {
        List<Do_gas_projects> resultList = new ArrayList<>();
        List<Do_gas_projects> authorProjectList = new ArrayList<>();
        for(Do_gas_projects projectDo : projectTagSet){
            String projectName = projectDo.getProject_name().toLowerCase();
            String authorName = projectDo.getAuthor().toLowerCase();
            String distributorName = projectDo.getDistributor().toLowerCase();
            if(projectName.contains(keyword.toLowerCase())){
                resultList.add(projectDo);
            }else if(authorName.contains(keyword.toLowerCase())){
                authorProjectList.add(projectDo);
            }else if(distributorName.contains(keyword.toLowerCase())){
                authorProjectList.add(projectDo);
            }
        }
        resultList.addAll(authorProjectList);
        return resultList;
    }

    private List<Do_gas_projects> searchProjectByName(String keyword){
        List<Do_gas_projects> resultList = new ArrayList<>();
        List<Do_gas_projects> authorProjectList = new ArrayList<>();
        for(Do_gas_projects projectDo : projectInfoCacheService.getGasProjectsList()){
            String projectName = projectDo.getProject_name().toLowerCase();
            String authorName = projectDo.getAuthor().toLowerCase();
            String distributorName = projectDo.getDistributor().toLowerCase();
            if(projectName.contains(keyword.toLowerCase())){
                resultList.add(projectDo);
            }else if(authorName.contains(keyword.toLowerCase())){
                authorProjectList.add(projectDo);
            }else if(distributorName.contains(keyword.toLowerCase())){
                authorProjectList.add(projectDo);
            }
        }
        resultList.addAll(authorProjectList);
        return resultList;
    }

    private List<Do_gas_projects> searchProjectByTag(String keyword){
        List<Do_gas_projects> resultList = mapper_gas_project_tag.getProjectIdListByTagName(keyword);
        return resultList;
    }

    private String getGameType(Do_gas_projects projectDo){
        String platformPinYins[] = projectDo.getGame_type().split(",");
        StringBuilder platformBuilder = new StringBuilder();
        for(String platformPinYin : platformPinYins){
            String platform = "";
            if(platformPinYin.equalsIgnoreCase("S")){
                platform = "手游";
            }else if(platformPinYin.equalsIgnoreCase("D")){
                platform = "端游";
            }else if(platformPinYin.equalsIgnoreCase("Y")){
                platform = "页游";
            }else if(platformPinYin.equalsIgnoreCase("W")){
                platform = "单机 电玩";
            }
            platformBuilder.append(platform).append(",");
        }
        if(platformBuilder.length() > 0){
            platformBuilder.deleteCharAt(platformBuilder.length() - 1);
        }

        String gameType = projectDo.getDetail_type_desc() + "/" + platformBuilder.toString();
        return gameType;
    }

    public DataResult findProjectQuery(String gameType, String detailType, Integer tagId) {
        Map<String, Object> dataMap = new LinkedHashMap<>();
        if(gameType != null){
            List<Integer> projectList = mapper_gas_projects.getProjectIdListByGameType(gameType);
            dataMap.put("project_list", projectList);
        }else if(detailType != null){
            List<Integer> projectList = mapper_gas_projects.getProjectIdListByDetailType(detailType);
            dataMap.put("project_list", projectList);
        }else if(tagId != null){
            List<Integer> projectList = mapper_gas_project_tag.getProjectIDListByTag(tagId);
            dataMap.put("project_list", projectList);
        }
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }
}
