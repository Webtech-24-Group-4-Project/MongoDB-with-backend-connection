// Use the phonebookDB database
use('phonebookDB');

async function main() {
    // Get references to the users and contacts collections
    const usersCollection = db.users;
    const contactsCollection = db.contacts;

    // Insert initial user data into the users collection
    await usersCollection.insertMany([
        { email: 'user1@example.com', password: 'password1' },
        { email: 'user2@example.com', password: 'password2' },
        { email: 'user3@example.com', password: 'password3' },
        { email: 'user4@example.com', password: 'password4' },
        { email: 'user5@example.com', password: 'password5' }
    ]);

    // Retrieve all users from the users collection
    const users = await usersCollection.find().toArray();

    // Define initial contact data with references to user IDs
    const contacts = [
        {
            first_name: 'Иван', last_name: 'Иванов', company: 'Фирма 1', email: 'ivan@example.com',
            url: 'http://ivan.example.com', address: { street: 'ул. Първа 1', city: 'София', state: 'София', postal_code: '1000', country: 'България' },
            birthday: new Date('1990-05-15'), other_date_type: 'anniversary', other_date: new Date('1990-05-15'),
            note: 'Някаква бележка за Иван Иванов', user_id: users.find(user => user.email === 'user1@example.com')._id,
            phones: [
                { phone_number: '0888123456', phone_type: 'personal' },
                { phone_number: '0287654321', phone_type: 'work' }
            ],
            social_media: [
                { platform: 'Facebook', username: 'ivan_ivanov' },
                { platform: 'Twitter', username: '@ivanov' }
            ]
        },
    ];

    // Insert initial contact data into the contacts collection
    await contactsCollection.insertMany(contacts);

    // CRUD Functions for Contacts and Users

    // Function to add a new contact
    async function addContact(contact) {
        try {
            if (!contact.first_name || !contact.last_name || !contact.user_id) {
                throw new Error('Missing required contact fields');
            }
            await contactsCollection.insertOne(contact);
            console.log('Contact added:', contact);
        } catch (error) {
            console.error('Error adding contact:', error.message);
        }
    }

    // Function to delete a contact by ID
    async function deleteContact(contactId) {
        await contactsCollection.deleteOne({ _id: contactId });
        console.log('Contact deleted:', contactId);
    }

    // Function to update a contact by ID with new information
    async function updateContact(contactId, updatedInfo) {
        await contactsCollection.updateOne({ _id: contactId }, { $set: updatedInfo });
        console.log('Contact updated:', contactId, updatedInfo);
    }

    // Function to add a new user
    async function addUser(user) {
        await usersCollection.insertOne(user);
        console.log('User added:', user);
    }

    // Function to delete a user by ID
    async function deleteUser(userId) {
        await usersCollection.deleteOne({ _id: userId });
        console.log('User deleted:', userId);
    }

    // Function to update a user by ID with new information
    async function updateUser(userId, updatedInfo) {
        await usersCollection.updateOne({ _id: userId }, { $set: updatedInfo });
        console.log('User updated:', userId, updatedInfo);
    }

    // Additional Functions

    // Function to perform a predictive search for contacts by partial name match
    async function searchContactsByName(partialName) {
        const results = await contactsCollection.find({
            $or: [
                { first_name: { $regex: partialName, $options: 'i' } },
                { last_name: { $regex: partialName, $options: 'i' } }
            ]
        }).toArray();
        console.log('Search results:', results);
        return results;
    }

    // Function to add a phone number to an existing contact
    async function addPhoneNumber(contactId, phone) {
        await contactsCollection.updateOne({ _id: contactId }, { $push: { phones: phone } });
        console.log('Phone number added:', phone);
    }

    // Function to remove a phone number from an existing contact
    async function removePhoneNumber(contactId, phoneNumber) {
        await contactsCollection.updateOne({ _id: contactId }, { $pull: { phones: { phone_number: phoneNumber } } });
        console.log('Phone number removed:', phoneNumber);
    }

    // Function to merge two contacts into one
    async function mergeContacts(primaryContactId, duplicateContactId) {
        const primaryContact = await contactsCollection.findOne({ _id: primaryContactId });
        const duplicateContact = await contactsCollection.findOne({ _id: duplicateContactId });

        const mergedContact = {
            ...primaryContact,
            phones: [...primaryContact.phones, ...duplicateContact.phones],
            social_media: [...primaryContact.social_media, ...duplicateContact.social_media],
            note: `${primaryContact.note || ''}\n${duplicateContact.note || ''}`
        };

        await contactsCollection.updateOne({ _id: primaryContactId }, { $set: mergedContact });
        await contactsCollection.deleteOne({ _id: duplicateContactId });
        console.log('Contacts merged:', primaryContactId, duplicateContactId);
    }

    // Function to get all contacts for a specific user by user ID
    async function getContactsForUser(userId) {
        const userContacts = await contactsCollection.find({ user_id: userId }).toArray();
        console.log('User contacts:', userContacts);
        return userContacts;
    }

    // Example calls to the functions
    const newContact = {
        first_name: 'Ново', last_name: 'Име', company: 'Нова фирма', email: 'new@example.com',
        url: 'http://new.example.com', address: { street: 'ул. Нова 1', city: 'София', state: 'София', postal_code: '1000', country: 'България' },
        birthday: new Date('1995-01-01'), other_date_type: 'other', other_date: new Date('1995-01-01'),
        note: 'Някаква нова бележка', user_id: users.find(user => user.email === 'user1@example.com')._id,
        phones: [{ phone_number: '0898123456', phone_type: 'personal' }],
        social_media: [{ platform: 'LinkedIn', username: 'new_user' }]
    };

    // Adding a new contact
    await addContact(newContact);

    // Updating a contact
    const contactToUpdate = await contactsCollection.findOne({ email: 'new@example.com' });
    await updateContact(contactToUpdate._id, { last_name: 'Променено' });

    // Deleting a contact
    await deleteContact(contactToUpdate._id);

    // Adding a new user
    const newUser = { email: 'newuser@example.com', password: 'newpassword' };
    await addUser(newUser);

    // Updating a user
    const userToUpdate = await usersCollection.findOne({ email: 'newuser@example.com' });
    await updateUser(userToUpdate._id, { password: 'updatedpassword' });

    // Deleting a user
    await deleteUser(userToUpdate._id);

    // Testing additional functions

    // Predictive search for contacts by name
    await searchContactsByName('Иван');

    // Adding a phone number to a contact
    const contactId = contactToUpdate._id;
    await addPhoneNumber(contactId, { phone_number: '0999999999', phone_type: 'work' });

    // Removing a phone number from a contact
    await removePhoneNumber(contactId, '0999999999');

    // Merging contacts (example should ideally merge two different contact IDs)
    await mergeContacts(contactId, contactId); // This should be two different contact IDs in real usage

    // Getting contacts for a user
    await getContactsForUser(users[0]._id);
}

// Run the main function and catch any errors
main().catch(console.error);
