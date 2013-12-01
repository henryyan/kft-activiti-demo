package me.kafeitu.demo.activiti.util.cache;

import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.infinispan.notifications.Listener;
import org.infinispan.notifications.cachelistener.annotation.CacheEntryCreated;
import org.infinispan.notifications.cachelistener.annotation.CacheEntryEvicted;
import org.infinispan.notifications.cachelistener.annotation.CacheEntryModified;
import org.infinispan.notifications.cachelistener.annotation.CacheEntryRemoved;
import org.infinispan.notifications.cachelistener.event.CacheEntryCreatedEvent;
import org.infinispan.notifications.cachelistener.event.CacheEntryEvictedEvent;
import org.infinispan.notifications.cachelistener.event.CacheEntryModifiedEvent;
import org.infinispan.notifications.cachelistener.event.CacheEntryRemovedEvent;
import org.infinispan.notifications.cachemanagerlistener.annotation.CacheStarted;
import org.infinispan.notifications.cachemanagerlistener.annotation.CacheStopped;
import org.infinispan.notifications.cachemanagerlistener.event.CacheStartedEvent;
import org.infinispan.notifications.cachemanagerlistener.event.CacheStoppedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Joram Barrez
 */
@SuppressWarnings("deprecation")
@Listener
public class CacheListener {

    private static final Logger logger = LoggerFactory.getLogger(CacheListener.class);

    @CacheStarted
    public void cacheStarted(CacheStartedEvent event) {
        logger.info("Distributed cache started");
    }

    @CacheStopped
    public void cacheStopped(CacheStoppedEvent event) {
        logger.info("Distributed cache stopped");
    }

    @CacheEntryModified
    public void cacheEntryModified(CacheEntryModifiedEvent<String, ProcessDefinitionEntity> event) {
        logger.info("Cache entry with key '" + event.getKey() + " modified in cache (local cache size = " + event.getCache().size() + ")");
    }

    @CacheEntryCreated
    public void cacheEntryCreated(CacheEntryCreatedEvent<String, ProcessDefinitionEntity> event) {
        logger.info("Cache entry with key '" + event.getKey() + " added to cache (local cache size = " + event.getCache().size() + ")");
    }

    @CacheEntryRemoved
    public void cacheEntryRemoved(CacheEntryRemovedEvent<String, ProcessDefinitionEntity> event) {
        logger.info("Cache entry with key '" + event.getKey() + " removed from cache (local cache size = " + event.getCache().size() + ")");
    }

    @CacheEntryEvicted
    public void cacheEntryEvicted(CacheEntryEvictedEvent<String, ProcessDefinitionEntity> event) {
        logger.info("Cache entry with key '" + event.getKey() + " evicted from cache (local cache size = " + event.getCache().size() + ")");
    }

}