name = "John";  
age = 25;
obj1=(1, 2, 3);
obj={"name": "Sourabh", "age": 25};


print(f"Hello, {name}! You are {age} years old.");
print("Hello, " + name + "! You are " + str(age) + " years old.",obj['name'],obj1[0]);

if (age >= 18):
    print("You are an adult.")
else:
    print("You are a minor.")

print("--------------------------------")
print("-------------for loop-------------------")

for i in range(5):
    print(i)

print("--------------------------------")
print("-------------function-------------------")

def add(a, b):
    return a + b

print(add(1, 2))

print("--------------------------------")
print("-------------class-------------------")

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        
    def say_hello(self):
        return f"Hello, {self.name}! You are {self.age} years old."
        
person = Person("Sourabh", 25)
print(person.say_hello())


print("--------------------------------")

import asyncio

def logger(func):
    async def wrapper():
        print("Before function")
        await func()
        print("After function")
    return wrapper

@logger
async def say_hello():
    print("Hello!")

# Run the async function
asyncio.run(say_hello())

        
        
        



