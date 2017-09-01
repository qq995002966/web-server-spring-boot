package cn.thinkingdata.web.service;

import cn.thinkingdata.nlp.game.GameOL;
import cn.thinkingdata.nlp.game.GameRecOLRS;
import cn.thinkingdata.nlp.main.TDNLP;
import cn.thinkingdata.web.domain.gas.Do_gas_project_tag;
import cn.thinkingdata.web.domain.gas.Do_gas_projects;
import cn.thinkingdata.web.domain.user.Do_user_recommend_projects;
import cn.thinkingdata.web.persistence.gas.Mapper_gas_project_tag;
import cn.thinkingdata.web.persistence.user.Mapper_user_recommend_projects;
import cn.thinkingdata.web.service.cache.ProjectInfoCacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GameRecommendService {	
	@Autowired
	private ProjectInfoCacheService projectInfoCacheService;
	@Autowired
	private Mapper_gas_project_tag mapper_gas_project_tag;
	@Autowired
	private Mapper_user_recommend_projects mapper_user_recommend_projects;

	public List<Integer> getRecommendGamesByTags(int userId,List<Integer> userTagList, int recommendNum){
		List<Do_gas_projects> projectList = projectInfoCacheService.getGasProjectsList();
		if(userTagList == null){
			userTagList = new ArrayList<>();
		}
		List<Do_gas_project_tag> projectTagList = new ArrayList<>();
		if(userTagList != null && userTagList.size() > 0){
			projectTagList = mapper_gas_project_tag.getByTags(userTagList);
		}

		HashMap<Integer, Set<Integer>> projTagMap = new HashMap<>();
		for(Do_gas_project_tag projectTag : projectTagList){
			Integer projectId = projectTag.getProject_id();
			Integer tagId = projectTag.getTag_id();
			Set<Integer> tagSet = projTagMap.get(projectId);
			if(tagSet == null){
				tagSet = new HashSet<Integer>();
			}
			tagSet.add(tagId);
			projTagMap.put(projectId, tagSet);		 
		}
		ArrayList<GameOL> gameList = new ArrayList<>();
		for(Do_gas_projects project : projectList){
			GameOL gameol = new GameOL();
			Integer projectId = project.getProject_id();
			Double hotScore = project.getHot_score();
			Set<Integer> tagSet = projTagMap.get(projectId);
			gameol.setHotScore(hotScore.intValue());
			gameol.setProject_id(projectId);
			gameol.setTagIds(tagSet);
			gameList.add(gameol);
		}
		List<GameRecOLRS> recomResultList = TDNLP.recGameByID(userTagList, gameList);
		ArrayList<Integer> recomProjectList = new ArrayList<>();
		for(int i = 0; i < recommendNum; i++){
			Integer projectId = recomResultList.get(i).getProjectId();
			float score = (float) recomResultList.get(i).getScore();
			recomProjectList.add(projectId);
			Do_user_recommend_projects userRecomProjects = new Do_user_recommend_projects();
			userRecomProjects.setUser_id(userId);
			userRecomProjects.setProject_id(projectId);
			userRecomProjects.setScore(score);
			mapper_user_recommend_projects.insertUserRecomProjects(userRecomProjects);
		}
		return recomProjectList;

	}



}
