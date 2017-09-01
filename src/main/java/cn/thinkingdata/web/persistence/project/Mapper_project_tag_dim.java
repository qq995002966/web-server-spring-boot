package cn.thinkingdata.web.persistence.project;


import cn.thinkingdata.web.domain.project.Do_project_tag_dim;

import java.util.ArrayList;

public interface Mapper_project_tag_dim {
	
	// 获取所有业务，包括status是0的
	public ArrayList<Do_project_tag_dim> getAll();
}
