package cn.thinkingdata.web.shiro;

import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.persistence.user.Mapper_user;
import cn.thinkingdata.web.util.StringUtil;
import cn.thinkingdata.web.util.StringUtil.AccountType;
import cn.thinkingdata.web.util.WebUtil;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 权限检查类
 * Created by Xiaowu on 2016/8/3.
 */
public class Realm  extends AuthorizingRealm {

    @Autowired
    private Mapper_user mapper_user;

    /**
     * 权限
     * @param principalCollection
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }

    /**
     * 登录验证
     * @param authenticationToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        String login_name = token.getUsername();
        Do_user user = null;
        AccountType accountType = StringUtil.getAccountType(login_name);
        if(accountType == AccountType.MOBILE){
            user = mapper_user.getUserInfoByMobile(login_name);
            StringBuilder sb = new StringBuilder(100);
            for (int i = 0; i < token.getPassword().length; i++) {
                sb.append(token.getPassword()[i]);
            }
            if(user.getPassword().equals(sb.toString())){
                WebUtil.saveCurrentUser(user);
                AuthenticationInfo authcInfo = new SimpleAuthenticationInfo(login_name, user.getPassword(),getName());
                return authcInfo;
            } else {
                throw new RuntimeException();
            }
        }else {
            if(accountType == AccountType.WX){
                user = mapper_user.getUserInfoByWX(login_name);
                user.setPassword("");
            }else if(accountType == AccountType.QQ){
                user = mapper_user.getUserInfoByQQ(login_name);
                user.setPassword("");
            }else {
                throw new AccountException();
            }
            WebUtil.saveCurrentUser(user);
            AuthenticationInfo authcInfo = new SimpleAuthenticationInfo(login_name, "",getName());
            return authcInfo;
        }
    }
}
