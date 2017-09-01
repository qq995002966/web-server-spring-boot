package cn.thinkingdata.web.domain.elasticsearch;

/**
 * Created by Xiaowu on 2016/9/27.
 */
public class Do_table_mapping {
    private Integer id;
    private String table_name;
    private String field_name;
    private String field_type;
    private String field_format;
    private String index_type;
    private String analyzer;
    private String search_analyzer;
    private Integer is_primary_key;
    private Integer is_partition_key;
    private Integer is_parent_key;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTable_name() {
        return table_name;
    }

    public void setTable_name(String table_name) {
        this.table_name = table_name;
    }

    public String getField_name() {
        return field_name;
    }

    public void setField_name(String field_name) {
        this.field_name = field_name;
    }

    public String getField_type() {
        return field_type;
    }

    public void setField_type(String field_type) {
        this.field_type = field_type;
    }

    public String getField_format() {
        return field_format;
    }

    public void setField_format(String field_format) {
        this.field_format = field_format;
    }

    public String getIndex_type() {
        return index_type;
    }

    public void setIndex_type(String index_type) {
        this.index_type = index_type;
    }

    public String getAnalyzer() {
        return analyzer;
    }

    public void setAnalyzer(String analyzer) {
        this.analyzer = analyzer;
    }

    public String getSearch_analyzer() {
        return search_analyzer;
    }

    public void setSearch_analyzer(String search_analyzer) {
        this.search_analyzer = search_analyzer;
    }

    public Integer getIs_primary_key() {
        return is_primary_key;
    }

    public void setIs_primary_key(Integer is_primary_key) {
        this.is_primary_key = is_primary_key;
    }

    public Integer getIs_partition_key() {
        return is_partition_key;
    }

    public void setIs_partition_key(Integer is_partition_key) {
        this.is_partition_key = is_partition_key;
    }

    public Integer getIs_parent_key() {
        return is_parent_key;
    }

    public void setIs_parent_key(Integer is_parent_key) {
        this.is_parent_key = is_parent_key;
    }
}
