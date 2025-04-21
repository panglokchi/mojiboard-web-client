'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [textboxExpanded, setTextboxExpanded] = useState(false);
  const [textboxInput, setTextboxInput] = useState('');
  const [textboxValid, setTextboxValid] = useState(true);
  const [showComments, setShowComments] = useState<number|null>(null)
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<any[]|null>(null)

  const updateMessages = () => {
    fetch('http://172.26.87.217:8080/message/top')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setData(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    updateMessages();
  }, []);

  const handleExpandTextBox = () => {
    setTextboxExpanded(!textboxExpanded);
  };

  const handleSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    try {
      const value = textboxInput;
      // Regular expression to check for emoji characters
      const emojiRegex = /[\p{Emoji}]/u;

      console.log(value)
      // Validate input: only allow emojis
      if (emojiRegex.test(value) || value === '') {

      } else {
        console.log("Only emojis")
        return;
      }
      

      const lines = textboxInput.split('\n');
      const title = lines[0]; // First line as title
      const content = lines.slice(1).join('\n'); // Rest as contents
      const time = new Date().toISOString(); // Current datetime in ISO format

      const payload = {
        title,
        content,
        time,
      };

      //console.log(payload)
    
      const response = await fetch('http://172.26.87.217:8080/message/add', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      //console.log('Response:', response.json);
      setTextboxInput(''); // Clear the input after submission
      setTextboxExpanded(false); // Optionally collapse after submission
      updateMessages();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    setTextboxInput(e.target.value)
  };

  useEffect(()=>{
    const value = textboxInput;
    const emojiRegex = /^([\p{Emoji}\s]+)$/u;

    if (emojiRegex.test(value)) {
      if (!textboxValid) setTextboxValid(true)
    } else {
      if (textboxValid) setTextboxValid(false)
    }
  }, [textboxInput])

  const convertNumberToEmoji = (number: string) => {
    const digits = String(number).split('');
    
    // Map each digit to its emoji representation
    const emojiDigits = digits.map(digit => {
        return String.fromCodePoint(0x0030 + parseInt(digit)) + "\uFE0F\u20E3"; // Adding the emoji variation and combining character
    });
    
    // Join the emoji digits back into a single string
    return emojiDigits.join('');
  }

  const loadComments = (id: number) => {
    fetch('http://172.26.87.217:8080/message/top?parentId='+id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setComments(data);
      });
  }

  const toggleComments = (id: number) => {
    if (showComments == id) {
      setCommentInput("");
      setShowComments(null);
      setComments(null);
    } else {
      setCommentInput("");
      setShowComments(id);
      loadComments(id);
    }
  }

  const handleSubmitComment  = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    try {
      if (showComments == null) return;

      const lines = commentInput.split('\n');
      const title = lines[0]; // First line as title
      const content = lines.slice(1).join('\n'); // Rest as contents
      const time = new Date().toISOString(); // Current datetime in ISO format
      const parentId = showComments

      const payload = {
        title,
        content,
        time,
        parentId
      };

      //console.log(payload)
    
      const response = await fetch('http://172.26.87.217:8080/message/add', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      //console.log('Response:', response.json);
      setTextboxInput(''); // Clear the input after submission
      setTextboxExpanded(false); // Optionally collapse after submission
      //updateMessages();
      loadComments(showComments);
      data.find(i => i.id == showComments).totalChildrenCount += 1;
    } catch (error) {
      //console.error('Error:', error);
    }
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)] h-screen overflow-hidden">
      <main className="flex flex-col items-center">
        <div className="p-3">
          💬
        </div>
        <div className="h-screen rounded-lg border border-gray-700 overflow-hidden">
          <div className="h-full flex flex-col w-100 max-w-[500px] bg-white dark:bg-[#181818] divide-y divide-gray-700 overflow-y-scroll">
            {
              !loading &&
              data.map((e) => (
                <div key={e.id} className="px-3 py-1">
                  <p>{e.title}</p>
                  <p>{e.content}</p>
                  <p onClick={()=>{toggleComments(e.id)}}>💬{convertNumberToEmoji(e.totalChildrenCount)}</p>
                  <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        showComments == e.id ? 'max-h-full opacity-100' : 'w-0 max-h-0 opacity-0'
                      }`}
                    >
                      {
                        comments == null &&
                        <div>⏳</div>
                      }
                      {
                        comments != null &&
                        <div className="px-3 py-1">
                          <form id="comment-form" onSubmit={handleSubmitComment} className="flex">
                            <input
                              value={commentInput}
                              onChange={(e) => setCommentInput(e.target.value)}
                              className="h-auto grow ps-1 me-2 border border-gray-300 rounded-lg"
                              placeholder="🗣️🗣️🗣️"
                              required
                              onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('‼️')}
                              onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                            />
                            
                            <button
                              form="comment-form"
                              type="submit"
                              className={`bg-green-500 text-white rounded-lg focus:outline-none rounded-lg bg-blue-500 text-white p-1`}
                            >
                              📢
                            </button>
                          </form>
                          {
                            comments.map((e) => (
                              <div key={e.id} className="mt-2">
                                <p>{e.title}</p>
                                <p>{e.content}</p>
                              </div>
                            ))
                          }
                        </div>
                      }
                  </div>
                </div>
              ))
            }
            <div>
              <br/><br/><br/><br/>
            </div>
          </div>
        </div>
      </main>
      <footer className="fixed bottom-0 right-0 mb-6 me-6 flex flex-col flex-wrap items-center justify-end
        bg-white dark:bg-[#181818] rounded-lg border border-gray-700">

        <button
            onClick={handleExpandTextBox}
            className={`rounded-lg bg-blue-500 text-white p-2 transition duration-300 ${
              textboxExpanded ? 'hidden' : ''
            }`}
          >
          ✍️
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            textboxExpanded ? 'max-h-40 opacity-100' : 'w-0 max-h-0 opacity-0'
          }`}
        >
          <form id="text-form" onSubmit={handleSubmit} className="">
            <textarea
              value={textboxInput}
              style={{resize: "none"}}
              onChange={handleChange}
              className="h-auto w-full p-2 rounded-lg accent-transparen focus:outline-hidden"
              placeholder="🗣️🗣️🗣️"
              required
              //onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('‼️')}
              onInput={
                e => {
                  const value = textboxInput;
                  const emojiRegex = /[\p{Emoji}]/u;
                  if (emojiRegex.test(value) || value === '') {
                    (e.target as HTMLInputElement).setCustomValidity('')
                  } else {
                    (e.target as HTMLInputElement).setCustomValidity('🚫🔤')
                    return;
                  }
                }
              }
            />
            
          </form>
        </div>

        <div className={`flex w-full justify-between p-2 ${ textboxExpanded ? '' : 'hidden' }`}>

          <div className="flex">
            <button
              onClick={handleExpandTextBox}
              className={`rounded-lg transition duration-300 ${
                textboxExpanded ? '' : 'hidden'
              }`}
            >
              🧹
            </button>

            <div className={`ms-2 transition duration-500 ${ textboxValid ? 'opacity-0' : 'opacity-100' }`}>
              🚫🔤
            </div>

          </div>


          <div className="flex">
            <button
              form="text-form"
              type="submit"
              className={`bg-transparent cursor-pointer rounded-lg focus:outline-none rounded-lg text-white transition duration-300 ${
                textboxExpanded ? '' : 'hidden'
              }`}
            >
              🤖
            </button>
            <button
              form="text-form"
              type="submit"
              className={`bg-transparent cursor-pointer text-white rounded-lg focus:outline-none rounded-lg text-white transition duration-300 ms-2 ${
                textboxExpanded ? '' : 'hidden'
              }`}
            >
              📢
            </button>
          </div>
        </div>
        
        
      </footer>
    </div>
  );
}
