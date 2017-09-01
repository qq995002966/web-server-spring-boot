package cn.thinkingdata.web.persistence.project.chat;


import cn.thinkingdata.web.domain.project.chat.Do_proj_chat_topwords_common;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_proj_chat_topwords_common {
    public List<Do_proj_chat_topwords_common> get(@Param("info_id") int info_id, @Param("user_id") int user_id);
    public List<Do_proj_chat_topwords_common> getJustByInfoId(@Param("info_id") int info_id);
}
