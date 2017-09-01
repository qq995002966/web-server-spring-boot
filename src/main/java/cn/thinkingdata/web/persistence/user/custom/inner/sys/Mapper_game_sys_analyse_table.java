package cn.thinkingdata.web.persistence.user.custom.inner.sys;

import cn.thinkingdata.web.domain.user.custom.inner.sys.Do_game_sys_analyse_table;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Carpenter on 2016/12/5.
 */
public interface Mapper_game_sys_analyse_table {

    public List<Do_game_sys_analyse_table> findTableListByMenuId(@Param("menu_id") Integer menuId);
}
