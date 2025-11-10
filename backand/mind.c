|#include <stdio.h>   // Input/Output functions ke liye
#include <string.h>  // String functions (strcmp, strcpy, etc.) ke liye

// Structure for user data store karne ke liye
struct User {
    char name[50];
    char username[50];
    char password[50];
};

// Structure for message (conversation)
struct Message {
    char sender[10];
    char text[200];
};

// Global variables
struct User users[100];   // Max 100 users
int userCount = 0;        // Kitne users ban chuke hain
struct User currentUser;  // Login user info
char currentMode[20];     // introvert / extrovert mode
struct Message history[200]; // Chat history
int messageCount = 0;     // Total messages count

// Function declarations
void signup();
void login();
void selectMode();
void chat();
void addMessage(char sender[], char text[]);
void showMessages();
void botResponse(char userMsg[]);
int checkCrisis(char msg[]);

// Main function start
int main() {
    int choice;  // user ka option store karne ke liye

    printf("===========================================\n");
    printf("         🌙 WELCOME TO MINDMATE 🌙\n");
    printf("===========================================\n");

    while (1) {
        printf("\n1. Signup\n2. Login\n3. Exit\nChoose: ");
        scanf("%d", &choice);   // user ka input lena

        if (choice == 1) {
            signup();           // Signup function call
        } else if (choice == 2) {
            login();            // Login function call
        } else if (choice == 3) {
            printf("\nGoodbye! 🌿\n");
            break;              // Loop se bahar nikal jao (program end)
        } else {
            printf("Invalid choice! Try again.\n");
        }
    }

    return 0;
}

// ===================== SIGNUP FUNCTION ===================== //
void signup() {
    struct User newUser;   // Naya user structure

    printf("\nEnter your name: ");
    scanf("%s", newUser.name);   // Name lena

    printf("Choose a username: ");
    scanf("%s", newUser.username);  // Username lena

    // Check if username already exists
    for (int i = 0; i < userCount; i++) {
        if (strcmp(users[i].username, newUser.username) == 0) {
            printf("⚠️ Username already exists! Try another.\n");
            return;
        }
    }

    printf("Choose a password: ");
    scanf("%s", newUser.password);  // Password lena

    // Save user data
    users[userCount] = newUser;     
    userCount++;

    printf("\n✅ Signup successful!\n");
    strcpy(currentUser.name, newUser.name);
    strcpy(currentUser.username, newUser.username);
    strcpy(currentUser.password, newUser.password);

    selectMode();   // Signup ke baad mode choose karne ka option
}

// ===================== LOGIN FUNCTION ===================== //
void login() {
    char username[50], password[50];
    int found = 0;

    printf("\nEnter username: ");
    scanf("%s", username);
    printf("Enter password: ");
    scanf("%s", password);

    // Loop se user check karna
    for (int i = 0; i < userCount; i++) {
        if (strcmp(users[i].username, username) == 0 && strcmp(users[i].password, password) == 0) {
            currentUser = users[i];
            found = 1;
            break;
        }
    }

    if (found) {
        printf("\n✅ Login successful! Welcome %s.\n", currentUser.name);
        selectMode();   // Mode select function call
    } else {
        printf("❌ Invalid username or password!\n");
    }
}

// ===================== MODE SELECTION FUNCTION ===================== //
void selectMode() {
    int choice;
    printf("\nSelect your chat mode:\n1. Introvert 🌙\n2. Extrovert ✨\nChoose: ");
    scanf("%d", &choice);

    if (choice == 1) {
        strcpy(currentMode, "introvert");
        printf("\n🌙 You are in Introvert mode.\n");
        printf("Hello %s, this is your quiet space.\n", currentUser.name);
    } else {
        strcpy(currentMode, "extrovert");
        printf("\n✨ You are in Extrovert mode.\n");
        printf("Hey %s! Ready to dive in?\n", currentUser.name);
    }

    chat();  // Chat function call
}

// ===================== CHAT FUNCTION ===================== //
void chat() {
    char msg[200];

    printf("\n(Type 'exit' to end chat)\n");

    while (1) {
        printf("\nYou: ");
        scanf(" %[^\n]", msg);  // Line input lena (with spaces)

        if (strcmp(msg, "exit") == 0) {
            printf("\nSession ended 🌿\n");
            break;
        }

        addMessage("user", msg);  // user message save karna

        if (checkCrisis(msg)) {
            botResponse("crisis");
            continue;
        }

        botResponse(msg);   // Bot ka jawab dena
    }
}

// ===================== ADD MESSAGE FUNCTION ===================== //
void addMessage(char sender[], char text[]) {
    strcpy(history[messageCount].sender, sender);  // Sender set karna
    strcpy(history[messageCount].text, text);      // Message set karna
    messageCount++;                                // Message count badhana
}

// ===================== CHECK CRISIS FUNCTION ===================== //
int checkCrisis(char msg[]) {
    // Crisis keywords
    char *words[] = {"suicide", "kill", "die", "hurt", "end"};
    for (int i = 0; i < 5; i++) {
        if (strstr(msg, words[i]) != NULL) {
            return 1;  // Crisis found
        }
    }
    return 0;
}

// ===================== BOT RESPONSE FUNCTION ===================== //
void botResponse(char userMsg[]) {
    if (strcmp(userMsg, "crisis") == 0) {
        printf("\nBot: 🚨 Please reach out for help immediately!\n");
        printf("📞 National Helpline: 988\n");
        return;
    }

    // Keywords based response
    if (strstr(userMsg, "sad") || strstr(userMsg, "depress")) {
        printf("\nBot: I'm here with you 🕊️ Let's talk about it.\n");
    } 
    else if (strstr(userMsg, "happy") || strstr(userMsg, "good")) {
        printf("\nBot: That's wonderful! 🌤️ Tell me more!\n");
    } 
    else if (strstr(userMsg, "tired") || strstr(userMsg, "sleep")) {
        printf("\nBot: Rest is important 🌙 Try to relax.\n");
    } 
    else if (strstr(userMsg, "help")) {
        printf("\nBot: I'm here to help 🌿 What do you need?\n");
    } 
    else if (strstr(userMsg, "thanks")) {
        printf("\nBot: You're welcome! ✨ Always here for you.\n");
    } 
    else {
        // Random generic response
        if (strcmp(currentMode, "introvert") == 0) {
            printf("\nBot: I hear you 🌿\n");
        } else {
            printf("\nBot: That's awesome! 🚀\n");
        }
    }
}

git init
