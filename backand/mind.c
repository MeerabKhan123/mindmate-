
#include <stdio.h>  // standard input/output functions ke liye
#include <string.h> // string functions jaise strcmp, strcpy, strstr ke liye

// Structure user data store karne ke liye
struct User {
    char name[50];       // user ka naam
    char username[50];   // username unique hoga
    char password[50];   // password for login
};

// Structure message history ke liye
struct Message {
    char sender[10];     // kisne bheja: "user" ya "bot"
    char text[200];      // message ka content
};

// Global variables
struct User users[100];  // 100 tak users store kar sakte hain
int userCount = 0;       // total registered users ka counter
struct User currentUser; // abhi ka logged-in user
char currentMode[20];    // "introvert" ya "extrovert"
struct Message history[200]; // chat history ke messages
int messageCount = 0;        // total messages count

// Function declarations (baad me define honge)
void signup();
void login();
void selectMode();
void chat();
void addMessage(char sender[], char text[]);
int checkCrisis(char msg[]);
void botResponse(char userMsg[]);

// Main function (program yahin se start hota hai)
int main() {
    int choice; // menu choice store karega

    printf("===========================================\n");
    printf("          WELCOME TO MINDMATE\n");
    printf("===========================================\n");

    while (1) { // infinite loop jab tak user exit na kare
        printf("\n1. Signup\n2. Login\n3. Exit\nChoose: ");
        scanf("%d", &choice); // user choice input lete hain

        if (choice == 1) { // agar user Signup chahta hai
            signup();      // signup function call
        } else if (choice == 2) { // agar login karna hai
            login();       // login function call
        } else if (choice == 3) { // agar exit karna hai
            printf("\nGoodbye!\n");
            break;         // loop se bahar nikal jao
        } else { // invalid choice
            printf("Invalid choice! Try again.\n");
        }
    }

    return 0; // program end
}

// ===================== SIGNUP FUNCTION ===================== //
void signup() {
    struct User newUser; // naya user banate hain

    printf("\nEnter your name: ");
    scanf("%s", newUser.name); // naam input

    printf("Choose a username: ");
    scanf("%s", newUser.username); // username input

    // duplicate username check
    for (int i = 0; i < userCount; i++) {
        if (strcmp(users[i].username, newUser.username) == 0) {
            printf("Username already exists! Try another.\n");
            return; // function end agar username duplicate hai
        }
    }

    printf("Choose a password: ");
    scanf("%s", newUser.password); // password input

    // user ko global array me save karo
    users[userCount] = newUser;
    userCount++; // user count increase

    printf("\nSignup successful!\n");

    // currentUser me naya user store karo
    strcpy(currentUser.name, newUser.name);
    strcpy(currentUser.username, newUser.username);
    strcpy(currentUser.password, newUser.password);

    selectMode(); // mode select karne ka next step
}

// ===================== LOGIN FUNCTION ===================== //
void login() {
    char username[50], password[50]; // temporary input variables
    int found = 0; // flag to check user mila ya nahi

    printf("\nEnter username: ");
    scanf("%s", username);
    printf("Enter password: ");
    scanf("%s", password);

    // check karte hain user array me exist karta hai ya nahi
    for (int i = 0; i < userCount; i++) {
        if (strcmp(users[i].username, username) == 0 &&
            strcmp(users[i].password, password) == 0) {
            currentUser = users[i]; // logged-in user set
            found = 1; // user mila
            break;
        }
    }

    if (found) {
        printf("\nLogin successful! Welcome %s.\n", currentUser.name);
        selectMode(); // agla step: mode select
    } else {
        printf("Invalid username or password!\n");
    }
}

// ===================== MODE SELECTION FUNCTION ===================== //
void selectMode() {
    int choice;
    printf("\nSelect your chat mode:\n1. Introvert\n2. Extrovert\nChoose: ");
    scanf("%d", &choice);

    if (choice == 1) { // introvert mode
        strcpy(currentMode, "introvert");
        printf("\nYou are in Introvert mode.\n");
        printf("Hello %s, this is your quiet space.\n", currentUser.name);
    } else { // extrovert mode
        strcpy(currentMode, "extrovert");
        printf("\nYou are in Extrovert mode.\n");
        printf("Hey %s! Ready to dive in?\n", currentUser.name);
    }

    chat(); // chat function start
}

// ===================== CHAT FUNCTION ===================== //
void chat() {
    char msg[200]; // user message store karega
    printf("\n(Type 'exit' to end chat)\n");

    while (1) {
        printf("\nYou: ");
        scanf(" %[^\n]", msg); // full sentence input (space ke sath)

        if (strcmp(msg, "exit") == 0) { // agar user exit likhta hai
            printf("\nSession ended.\n");
            break; // loop khatam
        }

        addMessage("user", msg); // user ka message history me add karo

        if (checkCrisis(msg)) { // agar msg me danger word hai
            botResponse("crisis"); // special response do
            continue; // agla message le lo
        }

        botResponse(msg); // normal bot reply
    }
}

// ===================== ADD MESSAGE FUNCTION ===================== //
void addMessage(char sender[], char text[]) {
    strcpy(history[messageCount].sender, sender); // sender set karo
    strcpy(history[messageCount].text, text);     // text copy karo
    messageCount++; // message counter badhao
}

// ===================== CHECK CRISIS FUNCTION ===================== //
int checkCrisis(char msg[]) {
    char *words[] = {"suicide", "kill", "die", "hurt", "end"}; // sensitive words
    for (int i = 0; i < 5; i++) {
        if (strstr(msg, words[i]) != NULL) { // agar koi word mila
            return 1; // crisis detected
        }
    }
    return 0; // safe message
}

// ===================== BOT RESPONSE FUNCTION ===================== //
void botResponse(char userMsg[]) {
    if (strcmp(userMsg, "crisis") == 0) { // special crisis message
        printf("\nBot: Please reach out for help immediately!\n");
        printf("National Helpline: 988\n");
        return; // function end
    }

    // normal emotional replies
    if (strstr(userMsg, "sad") || strstr(userMsg, "depress")) {
        printf("\nBot: I'm here with you. Let's talk about it.\n");
    } else if (strstr(userMsg, "happy") || strstr(userMsg, "good")) {
        printf("\nBot: That's wonderful! Tell me more!\n");
    } else if (strstr(userMsg, "tired") || strstr(userMsg, "sleep")) {
        printf("\nBot: Rest is important. Try to relax.\n");
    } else if (strstr(userMsg, "help")) {
        printf("\nBot: I'm here to help. What do you need?\n");
    } else if (strstr(userMsg, "thanks")) {
        printf("\nBot: You're welcome! Always here for you.\n");
    } else {
        // general responses based on mode
        if (strcmp(currentMode, "introvert") == 0) {
            printf("\nBot: I hear you.\n");
        } else {
            printf("\nBot: That's awesome!\n");
        }
    }
}
