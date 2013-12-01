package me.kafeitu.demo.activiti.util.cache;

import org.activiti.engine.impl.persistence.deploy.DeploymentCache;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.infinispan.Cache;
import org.infinispan.manager.CacheContainer;
import org.infinispan.manager.DefaultCacheManager;

/**
 * @author Joram Barrez
 */
public class DistributedCache implements DeploymentCache<ProcessDefinitionEntity> {

    protected Cache<String, ProcessDefinitionEntity> cache;

    public DistributedCache() {
        try {
            CacheContainer manager = new DefaultCacheManager("inifispan-cfg.xml");
            this.cache = manager.getCache();
            this.cache.addListener(new CacheListener());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public ProcessDefinitionEntity get(String id) {
        return cache.get(id);
    }

    public void add(String id, ProcessDefinitionEntity processDefinitionEntity) {
        cache.put(id, processDefinitionEntity);
    }

    public void remove(String id) {
        cache.remove(id);
    }

    public void clear() {
        cache.clear();
    }

}