package com.fyp.studentinterfaceservice.services;

import com.careerjet.webservice.api.Client;
import com.fyp.studentinterfaceservice.client.ProgradClient;
import com.fyp.studentinterfaceservice.model.Company;
import com.fyp.studentinterfaceservice.model.Position;
import com.fyp.studentinterfaceservice.services.interfaces.PositionService;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.fyp.studentinterfaceservice.client.ProgradClient.bearerToken;

@Service
public class PositionServiceImpl implements PositionService {

    private final ProgradClient client;

    public PositionServiceImpl(ProgradClient client) {
        this.client = client;
    }

    @Override
    public List<Position> getAllPositions() {
        return client.getAllPositions(bearerToken);
    }

    @Override
    public Position getPosition(Long id) {
        return client.findPositionById(bearerToken, id);
    }

    @Override
    public List<Position> searchPositions(String location, String keywords) {
        List<Position> positions = client.getAllPositions(bearerToken);
        List<String> keywordsList = new ArrayList<>(Arrays.asList(keywords.toLowerCase().split(" ")));
        String pattern = String.join("|", keywordsList);
        List<Position> matchedPositions = new ArrayList<>();
        for(Position position : positions) {
            Matcher matcher = Pattern.compile(pattern).matcher(position.getTitle().toLowerCase());
            if(matcher.find()) {
                matchedPositions.add(position);
            }
        }
        return matchedPositions;
    }

    public List<Position> searchJobsApi(String location, String keywords) {
        Client careerjetClient = new Client("en_GB");
        List<Position> positions = new ArrayList<>();

        Map<String, String> args1 = new HashMap<String, String>();
        args1.put("keywords", keywords);
        args1.put("location", location);

        args1.put("affid", "d5bae8e1fcebbd44fcda331aead3f612");

        args1.put("user_ip",    "Placeholder");
        args1.put("user_agent", "Placeholder");
        args1.put("url", "http://127.0.0.1/result");

        JSONObject results = (JSONObject) careerjetClient.search(args1);

        // A list of jobs is returned
        if (results.get("type").equals("JOBS")) {
            JSONArray jobs = (JSONArray) results.get("jobs");
            //System.out.println("Number of results:" + results.get("hits"));
            int index = 0;

            while( index < jobs.size()) {
                JSONObject job = (JSONObject) jobs.get(index);
                Position position = new Position();
                position.setTitle(job.get("title").toString());
                position.setDescription(job.get("description").toString());
                position.setLocation(job.get("locations").toString());
                position.setDate(job.get("date").toString());
                position.setUrl(job.get("url").toString());
                Company company = new Company();
                company.setName(job.get("company").toString());
                position.setCompany(company);
                positions.add(position);
                index++;
            }
        }

        // The location was amiguous. Suggestions are returned.
        // Add the location_id to the query to resolve the ambiguity.
//        if (results.get("type").equals("LOCATIONS")) {
//            System.out.println("Narrow down your location ");
//            System.out.println("Please specify a location");
//            JSONArray solvelocations = (JSONArray) results.get("solveLocations");
//            int index = 0;
//            while(index < solvelocations.size()) {
//                JSONObject l = (JSONObject) solvelocations.get(index);
//                System.out.println("NAME        :" + l.get("name"));
//                System.out.println("LOCATION ID :" + l.get("location_id"));
//                index++;
//            }
//        }

        // An error occured. An error message is returned.
        if (results.get("type").equals("ERROR")) {
            System.out.println("An error occurred whilst processing the search query");
            System.out.println("Error message    :" + results.get("ERROR"));
        }
        return positions;
    }
}
