package cn.thinkingdata.web.domain.user;

public class Do_wx_user_info {

	private Long id;
	private String openid;
	private String nickname;
	private String sex;
	private String city;
	private String country;
	private String province;
	private String headimgurl;
	private String unionid;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getOpenid() {
		return openid;
	}

	public void setOpenid(String openid) {
		this.openid = openid;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getHeadimgurl() {
		return headimgurl;
	}

	public void setHeadimgurl(String headimgurl) {
		this.headimgurl = headimgurl;
	}

	public String getUnionid() {
		return unionid;
	}

	public void setUnionid(String unionid) {
		this.unionid = unionid;
	}

	@Override
	public String toString() {
		return "Do_wx_user_info{" +
				"id=" + id +
				", openid='" + openid + '\'' +
				", nickname='" + nickname + '\'' +
				", sex='" + sex + '\'' +
				", city='" + city + '\'' +
				", country='" + country + '\'' +
				", province='" + province + '\'' +
				", headimgurl='" + headimgurl + '\'' +
				", unionid='" + unionid + '\'' +
				'}';
	}
}
