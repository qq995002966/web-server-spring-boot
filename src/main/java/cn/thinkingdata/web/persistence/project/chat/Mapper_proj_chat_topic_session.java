package cn.thinkingdata.web.persistence.project.chat;


import cn.thinkingdata.web.domain.project.chat.Do_proj_chat_topic_session;
import cn.thinkingdata.web.domain.project.chat.Do_proj_chat_topic_session2;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_proj_chat_topic_session {
    public List<Do_proj_chat_topic_session> getJustByInfoId(@Param("info_id") int info_id);
    public List<Do_proj_chat_topic_session2> getSessions(@Param("info_id") int info_id, @Param("user_id") int user_id, @Param("topic_id") String topic_id, @Param("index") int index, @Param("limit") int limit);
    public List<Do_proj_chat_topic_session2> getSessionsJustByInfoId(@Param("info_id") int info_id, @Param("topic_id") String topic_id, @Param("index") int index, @Param("limit") int limit);
    
}
