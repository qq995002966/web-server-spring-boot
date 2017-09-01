package cn.thinkingdata.web.service.cache;

import cn.thinkingdata.web.domain.admin.Do_admin_lt_cotype;
import cn.thinkingdata.web.domain.article.Do_article_source_dim;
import cn.thinkingdata.web.domain.gas.Do_gas_apps;
import cn.thinkingdata.web.domain.gas.Do_gas_crawler_info;
import cn.thinkingdata.web.domain.gas.Do_gas_projects;
import cn.thinkingdata.web.domain.gas.Do_gas_source_dim;
import cn.thinkingdata.web.domain.project.Do_project_tag_dim;
import cn.thinkingdata.web.persistence.admin.Mapper_admin_lt_cotype;
import cn.thinkingdata.web.persistence.article.Mapper_article_source_dim;
import cn.thinkingdata.web.persistence.gas.*;
import cn.thinkingdata.web.persistence.project.Mapper_project_tag_dim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author Carpenter
 * @date 2016/12/27 16:27
 * @description PeojectInfoCacheService
 */
@Service
@CacheConfig(cacheNames = "projectInfo")
public class ProjectInfoCacheService {

    @Autowired
    private Mapper_gas_crawler_info mapperGasCrawlerInfo;

    @Autowired
    private Mapper_gas_apps mapperGasApps;

    @Autowired
    private Mapper_gas_projects mapperGasProjects;

    @Autowired
    private Mapper_project_tag_dim mapperProjectTagDim;

    @Autowired
    private Mapper_gas_source_dim mapperGasSourceDim;

    @Autowired
    private Mapper_article_source_dim mapperArticleSourceDim;

    @Autowired
    private Mapper_admin_lt_cotype mapperAdminLtCotype;

    @Autowired
    private Mapper_gas_project_tag mapperGasProjectTag;

    @Cacheable(value = "project_name" ,key = "#root.method.name+':'+#projectId", condition = "#result != null")
    public String getProjectName(String projectId) {
        Do_gas_projects gasProjects = mapperGasProjects.getProjectById(Integer.valueOf(projectId));
        if(gasProjects != null){
            return gasProjects.getProject_name();
        }else{
            return "";
        }
    }

    @Cacheable(value = "project",key = "#root.method.name+':'+#projectId", condition = "#result != null")
    public Do_gas_projects getProjectsByProjectId(String projectId){
        Do_gas_projects project = mapperGasProjects.getProjectById(Integer.valueOf(projectId));
        return project;
    }

    @Cacheable(value = "gas_projects",key = "#root.method.name", condition = "#result != null")
    public List<Do_gas_projects> getGasProjectsList(){
        return mapperGasProjects.getAll();
    }

//    @Cacheable(value = "gas_app",key = "#root.method.name")
//    public List<Do_gas_apps> getGasAppsList(){
//        return mapperGasApps.getAll();
//    }

    @Cacheable(value = "project_tag",key = "#root.method.name", condition = "#result != null")
    public List<Do_project_tag_dim> getAllProjectTagList(){
        return mapperProjectTagDim.getAll();
    }

//    @Cacheable(value = "gas_crawler",key = "#root.method.name")
//    public List<Do_gas_crawler_info> getGasCrawlerInfoList(){
//        return mapperGasCrawlerInfo.getAll();
//    }

    @Cacheable(value = "gas_source_dim",key = "#root.method.name", condition = "#result != null")
    public List<Do_gas_source_dim> getGasSourceDimList(){
        return mapperGasSourceDim.getAll();
    }

    @Cacheable(value = "article_source_dim",key = "#root.method.name", condition = "#result != null")
    public List<Do_article_source_dim> getArticleSourceDimList(){
        return mapperArticleSourceDim.getArticleSourceDimList();
    }

//    @Cacheable(value = "admin_lt_cotype",key = "#root.method.name")
//    public List<Do_admin_lt_cotype> getAdminLtCotypeList(){
//        return mapperAdminLtCotype.getLtCommonTypeList();
//    }

    @Cacheable(value = "lt_common_type",key = "#root.method.name", condition = "#result != null")
    public Set<String> getLtCommonTypeSet(){
        Set<String> ltCommonTypeSet = new HashSet<>();
        List<Do_admin_lt_cotype> ltCoTypeList = mapperAdminLtCotype.getLtCommonTypeList();
        for(Do_admin_lt_cotype cotType : ltCoTypeList){
            ltCommonTypeSet.add(cotType.getType());
        }
        return ltCommonTypeSet;
    }

    @Cacheable(value = "project_id",key = "#root.method.name+':'+#appId", condition = "#result != null")
    public Integer getProjectByAppId(String appId){
        return mapperGasProjects.getProjectByAppId(appId);
    }

    @Cacheable(value = "project_id_tag",key = "#root.method.name+':'+#projectId")
    public List getTagListByProjectId(String projectId){
        List tags = mapperGasProjectTag.getProjectTagListByProject(Integer.valueOf(projectId));
        return tags;
    }

//    @Cacheable(value = "project_id_tag_name",key = "#root.method.name+':'+#projectId")
//    public List getTagNameListByProjectId(String projectId){
//        List tags = mapperGasProjectTag.getProjectTagListByProject(Integer.valueOf(projectId));
//        return tags;
//    }

    @Cacheable(value = "app_id_project",key = "#root.method.name+':'+#projectId", condition = "#result != null")
    public String getAppIdByProjectId(String projectId){
        String appId = mapperGasApps.getAppIdByProjectId(projectId);
        return appId;
    }

    public boolean isInfoidValid(String projectId, String infoId){
        Do_gas_crawler_info gasCrawlerInfo = this.getGasCrawlerInfoByInfoId(infoId);
        if(gasCrawlerInfo.getProject_id().toString().equals(projectId)){
            return true;
        }else {
            return false;
        }
    }

    @Cacheable(value = "info_valid_list",key = "#root.method.name+':'+#projectId", condition = "#result != null")
    public String getValidInfoidList(String projectId) {
        int cnt=0;
        String ret="";
        List<Do_gas_crawler_info> gasCrawlerInfoList = mapperGasCrawlerInfo.getInfoidListByProjectId(Integer.valueOf(projectId));
        for(Do_gas_crawler_info gasCrawlerInfo:gasCrawlerInfoList) {
            if(cnt==0) {
                ret+=(gasCrawlerInfo.getInfo_id().toString());
            } else {
                ret+=","+(gasCrawlerInfo.getInfo_id().toString());
            }
            cnt++;
        }
        return ret;
    }

    @Cacheable(value = "crawler_info_id",key = "#root.method.name+':'+#infoId", condition = "#result != null")
    public Do_gas_crawler_info getGasCrawlerInfoByInfoId(String infoId){
        return mapperGasCrawlerInfo.getGasCrawlerInfoByInfoId(Integer.valueOf(infoId));
    }

    public Boolean checkProjectId(Integer projectId){
        Do_gas_projects project = this.getProjectsByProjectId(projectId.toString());
        if(null != project){
            return true;
        }else {
            return false;
        }
    }
}
