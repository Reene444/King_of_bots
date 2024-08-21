package com.InstaCut.demo.controller;

import com.InstaCut.demo.model.Account;
import com.InstaCut.demo.payload.auth.*;
import com.InstaCut.demo.service.AccountService;
import com.InstaCut.demo.service.TokenService;
import com.InstaCut.demo.util.constants.AccountError;
import com.InstaCut.demo.util.constants.AccountSuccess;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Auth Controller", description = "Controller for Account management")
@Slf4j
@CrossOrigin(origins = {"*"},maxAge=3600)
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AccountService accountService;
    public AuthController(TokenService tokenService, AuthenticationManager authenticationManager){
        this.tokenService=tokenService;
        this.authenticationManager=authenticationManager;
    }


    @PostMapping("/token")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<TokenDTO> token(@Valid @RequestBody UserLoginDTO userLoginDTO)throws AuthenticationException {
    try {
        System.out.println("the controller recieve the requests");
        System.out.println("this is username and pwd:"+ userLoginDTO.getEmail()+" "+ userLoginDTO.getPassword());
        System.out.println(new UsernamePasswordAuthenticationToken(userLoginDTO.getEmail(), userLoginDTO.getPassword()));
        System.out.println(
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userLoginDTO.getEmail(), userLoginDTO.getPassword())));

        Authentication authentication= authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userLoginDTO.getEmail(), userLoginDTO.getPassword()));
            return  ResponseEntity.ok(new TokenDTO(tokenService.generateToken(authentication)));
        } catch (Exception e){
            log.debug(AccountError.TOKEN_GENERATION_ERROR.toString()+":"+e.getMessage());
            return new ResponseEntity<>(new TokenDTO(null),HttpStatus.BAD_REQUEST);
        }
      }

      @PostMapping(value = "/users/add",produces = "application/josn")
      @ResponseStatus(HttpStatus.CREATED)
      @ApiResponse(responseCode = "400",description = "Please enter a vaild email and password lenght between 6 to 20 characters")
      @ApiResponse(responseCode = "200",description = "Account added")
      @Operation(summary = "Add a new user")
      public ResponseEntity<String>addUser(@Valid  @RequestBody AccountDTO accountDTO){
        try{
            Account account=new Account();
            account.setEmail(accountDTO.getEmail());
            account.setPassword(accountDTO.getPassword());
            accountService.save(account);
            return ResponseEntity.ok(AccountSuccess.ACCOUNT_ADDED.toString());
        }catch (Exception e){
            log.debug(AccountError.ADD_ACCOUNT_ERROR.toString()+":"+e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        // the responsebody is null
        }
      }

      @GetMapping(value = "/users",produces = "application/json")
      @ApiResponse(responseCode = "200",description = "List of users")
      @ApiResponse(responseCode = "401",description = "Token missing")
      @ApiResponse(responseCode = "403",description = "Token error")
      @SecurityRequirement(name="album-system-api")
      @Operation(summary = "List user api")
      public List<AccountViewDTO> Users(){
        List<AccountViewDTO>accounts=new ArrayList<>();
        for(Account account:accountService.findall()){
            accounts.add(new AccountViewDTO(account.getId(),account.getEmail(), account.getAuthorities()));
        }
        return accounts;
      }
    @PutMapping(value = "/users/{user_id}/update-authorities",consumes = "application/json",produces = "application/json")
    @ApiResponse(responseCode = "200",description = "Update authorities")
    @ApiResponse(responseCode = "401",description = "Token missing")
    @ApiResponse(responseCode = "400",description = "Invalid user")
    @ApiResponse(responseCode = "403",description = "Token error")
    @ResponseStatus(HttpStatus.OK)
    @SecurityRequirement(name="album-system-api")
    @Operation(summary = "Update authorities")
    public ResponseEntity<AccountViewDTO> update_auth(@Valid @RequestBody AuthoritiesDTO authoritiesDTO, @PathVariable long user_id){

        Optional<Account>optionalAccount=accountService.findByID(user_id);
        if(optionalAccount.isPresent()){
            Account account=optionalAccount.get();
            account.setAuthorities(authoritiesDTO.getAuthorities());
            accountService.save(account);

            AccountViewDTO accountViewDTO=new AccountViewDTO(account.getId(),account.getEmail(),account.getAuthorities());

            return ResponseEntity.ok(accountViewDTO);
        }
        return new ResponseEntity<AccountViewDTO>(new AccountViewDTO(),HttpStatus.BAD_REQUEST);
    }
    @GetMapping(value = "/profile",produces = "application/json")
    @ApiResponse(responseCode = "200",description = "Profile of users")
    @ApiResponse(responseCode = "401",description = "Token missing")
    @ApiResponse(responseCode = "403",description = "Token error")
    @SecurityRequirement(name="album-system-api")
    @Operation(summary = "View profile")
    public ProfileDTO profile(Authentication authentication){
        String email = authentication.getName();
        Optional<Account>optionalAccount=accountService.findByEmail(email);

        Account account=optionalAccount.get();
        ProfileDTO profileDTO=new ProfileDTO(account.getId(),account.getEmail(),account.getAuthorities());
        return profileDTO;
    }

    @PutMapping(value = "/profile/update-password",consumes = "application/json",produces = "application/json")
    @ApiResponse(responseCode = "200",description = "Profile of users")
    @ApiResponse(responseCode = "401",description = "Token missing")
    @ApiResponse(responseCode = "403",description = "Token error")
    @SecurityRequirement(name="album-system-api")
    @Operation(summary = "Update profile")
    public AccountViewDTO update_password(@Valid @RequestBody PasswordDTO passwordDTO, Authentication authentication){
        String email = authentication.getName();
        Optional<Account>optionalAccount=accountService.findByEmail(email);

        Account account=optionalAccount.get();
        account.setPassword(passwordDTO.getPassword());
        accountService.save(account);

        AccountViewDTO accountViewDTO=new AccountViewDTO(account.getId(),account.getEmail(),account.getAuthorities());

        return accountViewDTO;

    }


    @DeleteMapping(value = "/profile/delete")
    @ApiResponse(responseCode = "200",description = "Profile of users")
    @ApiResponse(responseCode = "401",description = "Token missing")
    @ApiResponse(responseCode = "403",description = "Token error")
    @SecurityRequirement(name="album-system-api")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Delete profile")
    public ResponseEntity<String> delete_profile(Authentication authentication){
        String email = authentication.getName();
        Optional<Account>optionalAccount=accountService.findByEmail(email);
        if(optionalAccount.isPresent()){
            accountService.deleteById(optionalAccount.get().getId());
            return ResponseEntity.ok("User delete");
        }
        return new ResponseEntity<String>("Bad Request",HttpStatus.BAD_REQUEST);

    }
}
