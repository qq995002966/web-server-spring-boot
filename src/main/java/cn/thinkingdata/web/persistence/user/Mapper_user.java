package cn.thinkingdata.web.persistence.user;

import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.domain.user.Do_user_detail;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Xiaowu on 2016/8/3.
 */
public interface Mapper_user {

    Do_user getUserInfoById(@Param("user_id") Integer userId);

    Do_user getUserInfoByMobile(String mobile);

    Do_user getUserInfoByEmail(String email);

    int insertUser(Do_user userDo);

    int updateUser(Do_user userDo);

    int updateLastLogin(@Param("user_id") Integer userId,@Param("last_login_ip") String last_login_ip, @Param("last_login_time") Long last_login_time);

    int updatePassword(@Param("user_id") Integer userId,@Param("password") String password);

    int updateNickName(@Param("user_id") Integer userId,@Param("nick_name") String nickName);

    int updateProjectsId(@Param("user_id") Integer userId,@Param("projects_id") String projectsId);

    int updateEmail(@Param("user_id") Integer userId,@Param("email") String email);

    int getMaxUserId();

    Do_user checkUserInfoByNickname(@Param("nick_name") String nick_name, @Param("user_id") Integer userId);

    Do_user_detail getUserDetailById(@Param("user_id") Integer userId);

    int insertUpdateUserDetail(Do_user_detail userDetail);

    Do_user getUserInfoByQQ(String qqOpenId);

    Do_user getUserInfoByWX(String wxUnionId);

    int insertQQUser(Do_user userDo);

    int insertWXUser(Do_user userDo);

    List<String> getNickNameListByPreNick(String nickName);
}
