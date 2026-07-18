package com.odoohackathon.odoohackathon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class OdooHackathonApplication {

	public static void main(String[] args) {
		SpringApplication.run(OdooHackathonApplication.class, args);
	}

}
