package cn.thinkingdata.web.persistence.gas;

import cn.thinkingdata.web.domain.gas.Do_gas_chat_info;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;
import java.util.List;

public interface Mapper_gas_chat_info {
	public List<Do_gas_chat_info> get(@Param("user_id") int user_id, @Param("index") int index, @Param("limit") int limit);

	public int getTotal(@Param("user_id") int user_id);

	public int del(@Param("info_id") int info_id, @Param("user_id") int user_id);
	
	public List<Do_gas_chat_info> getByInfoIdList(@Param("user_id") int user_id, @Param("info_id_list") ArrayList<Long> info_id_list);
	
	public Do_gas_chat_info getJustByInfoId(@Param("info_id") int info_id);
	
	public int add(Do_gas_chat_info _do);
	
	public int setup(Do_gas_chat_info _do);
	
	public int getUserProcessingChatNum(int userId);
	
	public int reUpdateFile(@Param("info_id") int infoId, @Param("file_name") String fileName, @Param("file_bytes") int fileBytes);
	
	public int updateChatInfo(Do_gas_chat_info chatInfoDo);
	
	public int insertChatInfo(Do_gas_chat_info chatInfoDo);
	
	public int uploadFileSuccess(@Param("info_id") int infoId,@Param("file_bytes") int fileBytes);
}
