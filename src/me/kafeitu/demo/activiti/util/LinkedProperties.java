package me.kafeitu.demo.activiti.util;

import java.io.PrintStream;
import java.io.PrintWriter;
import java.util.*;

/**
 * 有序Properties
 */
public class LinkedProperties extends Properties {
    private static final long serialVersionUID = 1L;
    private Map<Object, Object> linkMap = new LinkedHashMap<Object, Object>();

    public void clear() {
        linkMap.clear();
    }

    public boolean contains(Object value) {
        return linkMap.containsValue(value);
    }

    public boolean containsKey(Object key) {
        return linkMap.containsKey(key);
    }

    public boolean containsValue(Object value) {
        return linkMap.containsValue(value);
    }

    public Enumeration elements() {
        throw new RuntimeException("Method elements is not supported in LinkedProperties class");
    }

    public Set entrySet() {
        return linkMap.entrySet();
    }

    public boolean equals(Object o) {
        return linkMap.equals(o);
    }

    public Object get(Object key) {
        return linkMap.get(key);
    }

    public String getProperty(String key) {
        Object oval = get(key); //here the class Properties uses super.get()
        if (oval == null) return null;
        return (oval instanceof String) ? (String) oval : null; //behavior of standard properties
    }

    public boolean isEmpty() {
        return linkMap.isEmpty();
    }

    public Enumeration keys() {
        Set keys = linkMap.keySet();
        return Collections.enumeration(keys);
    }

    public Set keySet() {
        return linkMap.keySet();
    }

    public void list(PrintStream out) {
        this.list(new PrintWriter(out, true));
    }

    public void list(PrintWriter out) {
        out.println("-- listing properties --");
        for (Map.Entry e : (Set<Map.Entry>) this.entrySet()) {
            String key = (String) e.getKey();
            String val = (String) e.getValue();
            if (val.length() > 40) {
                val = val.substring(0, 37) + "...";
            }
            out.println(key + "=" + val);
        }
    }

    public Object put(Object key, Object value) {
        return linkMap.put(key, value);
    }

    public int size() {
        return linkMap.size();
    }

    public Collection values() {
        return linkMap.values();
    }

}